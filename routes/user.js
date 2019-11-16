const router = require('express').Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user');
const User = require('../models/User');
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('admin'))

router
    .route('/')
        .get(advanceResults(User), getUsers)
        .post(createUser);

router
    .route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser)

module.exports = router;