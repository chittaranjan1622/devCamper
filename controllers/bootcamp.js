const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC 
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, data: bootcamps });
    } catch (error) {
        // res.status(400).json({success: false, data: null  })
        next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }
}

// @desc    Get single Bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC 
exports.getSingleBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        // res.status(400).json({ success: false, data: null });
        next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }
}

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps
// @access  PRIVATE
exports.createBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: bootcamp })
    } catch (error) {
        // res.status(400).json({ success: false, data: null })
        next(error);
    }
}

// @desc    Update single Bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  PRIVATE 
exports.updateBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
        }
    
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        // return res.status(400).json({ success: false, data: null });
        next(error);
    }
}

// @desc    Delete Single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  PRIVATE
exports.deleteBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
        }
    
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        // return res.status(400).json({ success: false, data: null });
        next(error);
    }
    
}