const router = require('express').Router({ mergeParams: true });
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/course');
const { protect, authorize } = require('../middlewares/auth');

const Course = require('../models/Courses');
const advanceResults = require('../middlewares/advanceResults');

router.route('/')
    .get(advanceResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;