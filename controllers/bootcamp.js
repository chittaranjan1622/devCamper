const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC 
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advanceResults);
});

// @desc    Get single Bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC 
exports.getSingleBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps
// @access  PRIVATE
exports.createBootcamps = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if the user has bootcamp published
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User has already published a bootcamp`, 400));
    }
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp })
});

// @desc    Update single Bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  PRIVATE 
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }

    // Make sure the user is owner of this bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User not authorized to update this bootcamp`, 401));
    }

    // Update the bootcamp
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete Single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  PRIVATE
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }

    // Make sure the user is owner of this bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User not authorized to delete this bootcamp`, 401));
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get Bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  PRIVATE
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians;
    // Divide distance by radius of the Earth
    // Radius of the Earth 3,963 miles (6,378 Km)
    const radius = parseInt(distance) / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [lat, lng], radius ]
            }
        }
    });

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })

});

// @desc    Upload photo for Bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  PRIVATE
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404));
    }

    // Make sure the user is owner of this bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User not authorized to upload photo to this bootcamp`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please add a file', 400));
    }

    const file = req.files.file;

    // Make sure the image is jpg
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please add a photo', 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse('Please upload ans image less than ' + process.env.MAX_FILE_UPLOAD, 400)
        );
    }

    // Create Custom Filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(
                new ErrorResponse('Problem with file upload ' + process.env.MAX_FILE_UPLOAD, 500)
            ); 
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })

    })

});