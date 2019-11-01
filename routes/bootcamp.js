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
const { protect } = require('../middlewares/auth');

const Bootcamp = require('../models/Bootcamp');

const advanceResults = require('../middlewares/advanceResults');

// Include othre resources router
const courseRouter = require('./courses');

// Re-route into other resources router
router.use('/:bootcampId/courses', courseRouter);

// This resource routers

router.route('/')
    .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamps)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(protect, updateBootcamps)
    .delete(protect, deleteBootcamps)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, bootcampPhotoUpload)

module.exports = router;