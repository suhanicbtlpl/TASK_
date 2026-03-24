const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ActivityService = require('../services/ActivityService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const flattenPermissions = (role) => {
    const permissions = [];
    if (role && role.permissions) {
        role.permissions.forEach(p => {
            if (p.permission && p.actions) {
                const name = p.permission.permissionName;
                if (p.actions.create) permissions.push(`${name}_CREATE`);
                if (p.actions.read) permissions.push(`${name}_READ`);
                if (p.actions.update) permissions.push(`${name}_UPDATE`);
                if (p.actions.delete) permissions.push(`${name}_DELETE`);
            }
        });
    }
    return permissions;
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isDeleted: false }).populate({
            path: 'role',
            populate: { path: 'permissions.permission' }
        });

        if (user && (await user.matchPassword(password))) {
            const permissions = flattenPermissions(user.role);
            
            const roleData = user.role ? {
                ...user.role._doc,
                permissions
            } : null;

            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            await ActivityService.logActivity(
                user._id, 
                'LOGIN', 
                'Auth', 
                `User logged in: ${user.name}`, 
                user._id, 
                user.name
            );

            return SuccessResponse(res, 'Login successful', {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                profilePhoto: user.profilePhoto,
                lastLogin: user.lastLogin,
                status: user.status,
                role: roleData,
                token: generateToken(user._id),
            });
        } else {
            return ErrorResponse(res, 'Invalid email or password', null, 401);
        }
    } catch (error) {
        return ErrorResponse(res, 'Login failed', error.message);
    }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'role',
            populate: { path: 'permissions.permission' }
        });

        if (user) {
            const permissions = flattenPermissions(user.role);
            const roleData = user.role ? {
                ...user.role._doc,
                permissions
            } : null;

            return SuccessResponse(res, 'Profile retrieved', {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                profilePhoto: user.profilePhoto,
                lastLogin: user.lastLogin,
                status: user.status,
                role: roleData,
            });
        } else {
            return ErrorResponse(res, 'User not found', null, 404);
        }
    } catch (error) {
        return ErrorResponse(res, 'Profile fetch failed', error.message);
    }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, isDeleted: false });
        if (!user) return ErrorResponse(res, 'User not found', null, 404);

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // In production, send email. For now, return token to user for testing.
        return SuccessResponse(res, 'Password reset token generated', { resetToken });
    } catch (error) {
        return ErrorResponse(res, 'Forgot password failed', error.message);
    }
};

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
            isDeleted: false
        });

        if (!user) return ErrorResponse(res, 'Invalid or expired token', null, 400);

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return SuccessResponse(res, 'Password reset successful');
    } catch (error) {
        return ErrorResponse(res, 'Reset password failed', error.message);
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return ErrorResponse(res, 'User not found', null, 404);

        user.name = req.body.name || user.name;
        user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
        
        if (req.file) {
            user.profilePhoto = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();
        
        return SuccessResponse(res, 'Profile updated successfully', {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobileNumber: updatedUser.mobileNumber,
            profilePhoto: updatedUser.profilePhoto,
            lastLogin: updatedUser.lastLogin,
            status: updatedUser.status
        });
    } catch (error) {
        return ErrorResponse(res, 'Profile update failed', error.message);
    }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            return SuccessResponse(res, 'Password changed successfully');
        } else {
            return ErrorResponse(res, 'Invalid old password', null, 400);
        }
    } catch (error) {
        return ErrorResponse(res, 'Password change failed', error.message);
    }
};

// @desc    Update user settings
// @route   PUT /api/v1/auth/settings
// @access  Private
const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return ErrorResponse(res, 'User not found', null, 404);

        user.settings = { ...user.settings, ...req.body };
        await user.save();
        
        return SuccessResponse(res, 'Settings updated successfully', user.settings);
    } catch (error) {
        return ErrorResponse(res, 'Settings update failed', error.message);
    }
};

module.exports = { loginUser, getUserProfile, forgotPassword, resetPassword, updateProfile, changePassword, updateSettings };