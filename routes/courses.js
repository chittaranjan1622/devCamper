const router = require('express').Router({ mergeParams: true });
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/course');

router.route('/')
    .get(getCourses)
    .post(addCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router;