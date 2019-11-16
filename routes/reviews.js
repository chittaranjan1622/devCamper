const router = require('express').Router({ mergeParams: true });
const {
    getReviews
} = require('../controllers/review');
const Review = require('../models/Review');
const { protect, authorize } = require('../middlewares/auth');
const advanceResults = require('../middlewares/advanceResults');

router.route('/')
    .get(advanceResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)

module.exports = router;