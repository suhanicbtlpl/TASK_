const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ActivityService = require('../services/ActivityService');
const Company = require('../models/Company');
const CompanyInfo = require('../models/CompanyInfo');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
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
            const permissions = user.getFlattenedPermissions();

            // Format the response consistent with industry standards
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                profilePhoto: user.profilePhoto,
                lastLogin: user.lastLogin,
                status: user.status,
                role: user.role ? { ...user.role._doc, permissions } : null,
                token: generateToken(user._id),
            };

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

            return SuccessResponse(res, 'Login successful', userData);
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
            const permissions = user.getFlattenedPermissions();
            const roleData = user.role ? { ...user.role._doc, permissions } : null;

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



const registerCompanyController = async (req, res) => {
    try {
        const { companyName, address, phone, website, description, ownerName, ownerEmail, ownerPassword, ownerMobile } = req.body;

        // Check if company exists
        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) return ErrorResponse(res, 'Company already exists', null, 400);

        // Check if owner exists
        const existingUser = await User.findOne({ email: ownerEmail });
        if (existingUser) return ErrorResponse(res, 'Owner email already registered', null, 400);

        // Find Owner Role
        const ownerRole = await Role.findOne({ roleName: 'Owner' });
        if (!ownerRole) return ErrorResponse(res, 'Owner role not found', null, 500);

        // Create Owner User
        const user = await User.create({
            name: ownerName,
            email: ownerEmail,
            password: ownerPassword,
            mobileNumber: ownerMobile,
            role: ownerRole._id
        });

        // Create Company
        const company = await Company.create({
            name: companyName,
            address,
            phone,
            website,
            description,
            owner: user._id,
            createdBy: user._id
        });

        // Link user to company
        user.company = company._id;
        await user.save();

        // Create public CompanyInfo
        await CompanyInfo.create({
            name: companyName,
            address,
            phone,
            website,
            description,
            companyId: company._id
        });

        // Log activity
        await ActivityService.logActivity(
            user._id,
            'COMPANY_REGISTER',
            'Auth',
            `Company registered: ${companyName}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Company registered successfully', { company, owner: user });

    } catch (error) {
        return ErrorResponse(res, 'Company registration failed', error.message);
    }
};

module.exports = { loginUser, getUserProfile, forgotPassword, resetPassword, updateProfile, changePassword, updateSettings ,registerCompanyController};