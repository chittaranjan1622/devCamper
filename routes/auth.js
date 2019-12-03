const router = require('express').Router();
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    logout
} = require('../controllers/auth');

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-details', protect, updateDetails);

module.exports = router;