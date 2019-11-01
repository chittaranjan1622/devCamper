const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  PUBLIC 

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create USer
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);

});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  PUBLIC 

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next (
            new ErrorResponse(`Please enter an email and password`, 400)
        )
    }

    // Check for User
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(
            new ErrorResponse(`Invalid Credentials`, 401)
        )
    }

    // Validate Password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(
            new ErrorResponse(`Invalid Credentials`, 401)
        ) 
    }

    sendTokenResponse(user, 200, res);

});

// Send token
const sendTokenResponse = (user, statusCode, res) => {
    // Get Token 
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

}

// @desc    Get User
// @route   GET /api/v1/auth/me
// @access  PRIVATE
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
