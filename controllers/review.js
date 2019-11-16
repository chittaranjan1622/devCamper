const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Courses');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  PUBLIC 
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.query.bootcampId) {
        const reviews = Review.find({ bootcamp: req.query.bootcampId });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advanceResults)
    }

})