const rateLimit = require('express-rate-limit');

// Rate limiting: 100 requests per 10 mins
exports.limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again after 10 minutes' },
});
