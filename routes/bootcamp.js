const router = require('express').Router();
const {
    getBootcamps,
    getSingleBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps,
    getBootcampsInRadius
} = require('../controllers/bootcamp');

// Include othre resources router
const courseRouter = require('./courses');

// Re-route into other resources router
router.use('/:bootcampId/courses', courseRouter);

// This resource routers

router.route('/')
    .get(getBootcamps)
    .post(createBootcamps)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;