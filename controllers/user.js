const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// @desc    Get All USers
// @route   GET /api/v1/users
// @access  PRIVATE/ADMIN 
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
});

// @desc    Get Single USers
// @route   GET /api/v1/user/:id
// @access  PRIVATE/ADMIN 
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user })
});

// @desc    Create USer
// @route    POST /api/v1/users
// @access  PRIVATE/ADMIN 
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user })
});

// @desc    Update USer
// @route    PUT /api/v1/user/:id
// @access  PRIVATE/ADMIN 
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: user })
});

// @desc    Delete USer
// @route   DELETE /api/v1/user/:id
// @access  PRIVATE/ADMIN 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} })
});

