const router = require('express').Router();
const {
    getBootcamps,
    getSingleBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamp');
const { protect, authorize } = require('../middlewares/auth');

const Bootcamp = require('../models/Bootcamp');

const advanceResults = require('../middlewares/advanceResults');

// Include othre resources router
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route into other resources router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

// This resource routers

router.route('/')
    .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamps)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(protect, authorize('publisher', 'admin'), updateBootcamps)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamps)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports = router;