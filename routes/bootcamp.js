const router = require('express').Router();
const {
    getBootcamps,
    getSingleBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps
} = require('../controllers/bootcamp');

router.route('/')
    .get(getBootcamps)
    .post(createBootcamps)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)

module.exports = router;