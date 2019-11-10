const crypto = require('crypto');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

// @desc    Update User
// @route   PUT /api/v1/auth/update-details
// @access  PRIVATE
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new :true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    })
})

// @desc    Change Password
// @route   PUT /api/v1/auth/change-password
// @access  PRIVATE
exports.changePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check Current Password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse(`Password is incorrect`, 401))
    }

    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
})

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  PRIVATE
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }

    // Get Reset Token
    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset Url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: message
        });

        res.status(200).json({ success: true, data: 'Email Sent' })
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email Could not be sent`, 500));
    }
})

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password/:resetToken
// @access  PUBLIC
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // Get hashed reset Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    // Set New Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
    
})

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
