const Order = require('../models/Order');
const SubOrder = require('../models/SubOrder');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    const { products, shippingAddress } = req.body;

    if (!shippingAddress) {
        return next(new ErrorResponse('Please provide a shipping address', 400));
    }

    if (products && products.length === 0) {
        return next(new ErrorResponse('No order items', 400));
    }

    let totalAmount = 0;
    const orderItems = [];
    const vendorMap = new Map(); // Group items by shop/vendor

    // Verify products, calculate total, and group by shop
    for (const item of products) {
        const product = await Product.findById(item.product).populate('shop');

        if (!product) {
            return next(new ErrorResponse(`Product ${item.product} not found`, 404));
        }

        if (product.stock < item.quantity) {
            return next(new ErrorResponse(`Product ${product.name} is out of stock`, 400));
        }

        // Update stock
        product.stock -= item.quantity;
        await product.save();

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
        });

        // Grouping for SubOrders
        const shopId = product.shop._id.toString();
        if (!vendorMap.has(shopId)) {
            vendorMap.set(shopId, {
                vendor: product.shop.owner,
                shop: product.shop._id,
                items: [],
                totalAmount: 0
            });
        }

        const vendorData = vendorMap.get(shopId);
        vendorData.items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity
        });
        vendorData.totalAmount += itemTotal;
    }

    // 1. Create Parent Order
    const order = await Order.create({
        user: req.user._id,
        products: orderItems,
        totalAmount,
        shippingAddress
    });

    // 2. Create Sub-Orders for each vendor
    const subOrderPromises = Array.from(vendorMap.values()).map(data => {
        return SubOrder.create({
            parentOrder: order._id,
            vendor: data.vendor,
            shop: data.shop,
            items: data.items,
            totalAmount: data.totalAmount
        });
    });

    await Promise.all(subOrderPromises);

    // Send confirmation email
    try {
        await sendEmail({
            email: req.user.email,
            subject: 'Order Confirmation',
            message: `Hi ${req.user.name},\n\nYour order has been placed successfully. Order ID: ${order._id}\nTotal: ${totalAmount}\n\nThanks!`,
        });
    } catch (error) {
        console.error('Email send failed:', error);
    }

    res.status(201).json({ success: true, data: order });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).populate(
        'products.product',
        'name price'
    );

    res.status(200).json({ success: true, data: orders });
});

// @desc    Get orders for a specific vendor's products
// @route   GET /api/orders/vendor
// @access  Private (Vendor)
exports.getVendorOrders = asyncHandler(async (req, res, next) => {
    const subOrders = await SubOrder.find({ vendor: req.user._id })
        .populate({
            path: 'parentOrder',
            populate: { path: 'user', select: 'name email' }
        })
        .populate('shop', 'name')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: subOrders.length, data: subOrders });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({})
        .populate('user', 'id name')
        .populate('products.product', 'name price');

    res.status(200).json({ success: true, data: orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Shop Owner)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    let subOrder = await SubOrder.findById(req.params.id);

    // If not subOrder, maybe it's a parent order (for admins)
    if (!subOrder) {
        if (req.user.role !== 'admin') {
            return next(new ErrorResponse('Order not found or not authorized', 404));
        }

        const order = await Order.findById(req.params.id);
        if (!order) return next(new ErrorResponse('Order not found', 404));

        order.status = status;
        await order.save();
        return res.status(200).json({ success: true, data: order });
    }

    // Make sure user is shop owner
    if (subOrder.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update this order`, 403));
    }

    subOrder.status = status;
    await subOrder.save();

    // Optionally update parent order status if all sub-orders are delivered/cancelled
    const otherSubOrders = await SubOrder.find({ parentOrder: subOrder.parentOrder });
    const allFinished = otherSubOrders.every(so => ['delivered', 'cancelled'].includes(so.status));

    if (allFinished) {
        const parentOrder = await Order.findById(subOrder.parentOrder);
        // This is a simplified logic - you might want more nuanced parent status
        parentOrder.status = 'delivered'; // or some 'completed' flag
        await parentOrder.save();
    }

    res.status(200).json({ success: true, data: subOrder });
});
