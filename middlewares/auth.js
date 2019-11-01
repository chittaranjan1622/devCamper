const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.header.authorization && req.header.authorization.startsWith('Bearer')) {
        token = req.header.authorization.split(' ')[1];
    } /* else if (req.cookies.token) {
        token = req.cookies.token
    } */

    // Make sure token exists

    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401))
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, process.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id); 
    } catch (err) {
        return next(new ErrorResponse('Not authorize to access this route', 401))
    }
})