const router = require('express').Router({ mergeParams: true });
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/course');
const { protect } = require('../middlewares/auth');

const Course = require('../models/Courses');
const advanceResults = require('../middlewares/advanceResults');

router.route('/')
    .get(advanceResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, addCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse)

module.exports = router;