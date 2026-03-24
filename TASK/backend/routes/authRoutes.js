const express = require('express');
const router = express.Router();
const { 
    loginUser, 
    getUserProfile, 
    forgotPassword, 
    resetPassword, 
    updateProfile, 
    changePassword,
    updateSettings 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer for Profile Photo
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const { validate, authRules } = require('../middleware/validator');

router.post('/login', authRules.login, validate, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePhoto'), authRules.updateProfile, validate, updateProfile);
router.put('/change-password', protect, authRules.changePassword, validate, changePassword);
router.put('/settings', protect, updateSettings);
router.post('/forgot-password', authRules.forgotPassword, validate, forgotPassword);
router.post('/reset-password/:token', authRules.resetPassword, validate, resetPassword);



module.exports = router;

