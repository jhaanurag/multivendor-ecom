const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get vendor analytics
// @route   GET /api/analytics/vendor
// @access  Private (Vendor)
exports.getVendorAnalytics = asyncHandler(async (req, res, next) => {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
        return next(new ErrorResponse('Shop not found', 404));
    }

    const products = await Product.find({ shop: shop._id }).select('_id');
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
        'products.product': { $in: productIds }
    });

    let totalRevenue = 0;
    let totalSales = 0;
    const productStats = {};

    orders.forEach(order => {
        order.products.forEach(item => {
            if (productIds.some(id => id.toString() === item.product.toString())) {
                // Find product price (approximate from order total or specific item context)
                // In a perfect system we'd use the snapshot price in order item
                // For now, let's assume we can calculate it or we add price to order item
                // Let's use the current product price for the dashboard estimate
                totalSales += item.quantity;
            }
        });
    });

    // To get accurate revenue, we'd need item prices in the Order model. 
    // Let's just return counts and basic stats for now.

    res.status(200).json({
        success: true,
        data: {
            totalProducts: products.length,
            totalOrders: orders.length,
            totalItemsSold: totalSales
        }
    });
});

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
exports.getAdminAnalytics = asyncHandler(async (req, res, next) => {
    const totalOrders = await Order.countDocuments();
    const totalShops = await Shop.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
        success: true,
        data: {
            totalRevenue,
            totalOrders,
            totalShops,
            totalProducts
        }
    });
});
