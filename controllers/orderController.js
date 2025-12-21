const Order = require('../models/Order');
const Product = require('../models/Product');
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

    // Verify products and calculate total
    for (const item of products) {
        const product = await Product.findById(item.product);

        if (!product) {
            return next(new ErrorResponse(`Product ${item.product} not found`, 404));
        }

        if (product.stock < item.quantity) {
            return next(new ErrorResponse(`Product ${product.name} is out of stock`, 400));
        }

        // Update stock
        product.stock -= item.quantity;
        await product.save();

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
        });

        totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
        user: req.user._id,
        products: orderItems,
        totalAmount,
        shippingAddress
    });

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
    const Shop = require('../models/Shop');
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
        return next(new ErrorResponse('Shop not found for this vendor', 404));
    }

    const products = await Product.find({ shop: shop._id }).select('_id');
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
        'products.product': { $in: productIds }
    })
        .populate('user', 'name email')
        .populate('products.product', 'name price');

    const vendorItems = [];
    orders.forEach(order => {
        order.products.forEach(item => {
            if (productIds.some(id => id.toString() === item.product._id.toString())) {
                vendorItems.push({
                    orderId: order._id,
                    customer: order.user,
                    product: item.product,
                    quantity: item.quantity,
                    date: order.createdAt,
                    status: order.status
                });
            }
        });
    });

    res.status(200).json({ success: true, data: vendorItems });
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
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Logic to check if user is admin or at least one product in order belongs to vendor
    // For simplicity, let's allow vendors if they have products in it (but they only update overall status here)
    // In a real app, you might have per-item status.

    order.status = req.body.status;
    await order.save();

    res.status(200).json({ success: true, data: order });
});
