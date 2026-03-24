const StaffService = require('../services/StaffService');
const ActivityService = require('../services/ActivityService');
const EmailService = require('../services/EmailService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get all staff with search and pagination
// @route   GET /api/v1/staff
// @access  Private
const getStaff = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await StaffService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Staff retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching staff', error.message);
    }
};

// @desc    Create new staff member
// @route   POST /api/v1/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
    try {
        // const { email } = req.body;
        const { name, email, password, mobileNumber, role } = req.body;
        
        // Check for ANY existing user with this email (including soft-deleted)
        const existing = await StaffService.model.findOne({ email });
        if (existing) {
            if (existing.isDeleted) {
                return ErrorResponse(res, 'A user with this email exists in the Recycle Bin. Please restore it or use a different email.', null, 400);
            }
            return ErrorResponse(res, 'User with this email already exists', null, 400);
        }


        const user = await StaffService.create({
            name,
            email,
            password,
            mobileNumber,
            role
        });

        // Populate role to get roleName for email
        const populatedUser = await StaffService.model.findById(user._id).populate('role');

        // Send welcome email (async, don't block response)
        EmailService.sendWelcomeEmail({
            name: user.name,
            email: user.email,
            password: password,
            roleName: populatedUser.role?.roleName
        }).catch(err => console.error('Error sending welcome email:', err));

        await ActivityService.logActivity(
            req.user._id,
            'CREATE',
            'Staff',
            `Created staff member: ${user.name}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Staff created successfully', user, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating staff', error.message, 400);
    }
};

// @desc    Update staff member
// @route   PUT /api/v1/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
    try {
        const user = await StaffService.update(req.params.id, req.body);
        if (!user) {
            return ErrorResponse(res, 'User not found', null, 404);
        }

        await ActivityService.logActivity(
            req.user._id,
            'UPDATE',
            'Staff',
            `Updated staff member: ${user.name}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Staff updated successfully', user);
    } catch (error) {
        return ErrorResponse(res, 'Error updating staff', error.message, 400);
    }
};

// @desc    Soft delete staff member
// @route   DELETE /api/v1/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
    try {
        const user = await StaffService.softDelete(req.params.id);
        if (!user) {
            return ErrorResponse(res, 'User not found', null, 404);
        }

        await ActivityService.logActivity(
            req.user._id,
            'DELETE',
            'Staff',
            `Soft deleted staff member: ${user.name}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Staff soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting staff', error.message, 400);
    }
};

// @desc    Get deleted staff
// @route   GET /api/v1/staff/deleted
// @access  Private/Admin
const getDeletedStaff = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await StaffService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted staff retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted staff', error.message);
    }
};

// @desc    Restore staff
// @route   PUT /api/v1/staff/:id/restore
// @access  Private/Admin
const restoreStaff = async (req, res) => {
    try {
        const user = await StaffService.restore(req.params.id);
        if (!user) return ErrorResponse(res, 'User not found', null, 404);

        await ActivityService.logActivity(
            req.user._id,
            'RESTORE',
            'Staff',
            `Restored staff member: ${user.name}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Staff restored successfully', user);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring staff', error.message, 400);
    }
};

// @desc    Permanent delete staff
// @route   DELETE /api/v1/staff/:id/permanent
// @access  Private/Admin
const permanentDeleteStaff = async (req, res) => {
    try {
        const user = await StaffService.permanentDelete(req.params.id);
        if (!user) return ErrorResponse(res, 'User not found or not in Recycle Bin', null, 404);

        await ActivityService.logActivity(
            req.user._id,
            'PERMANENT_DELETE',
            'Staff',
            `Permanently deleted staff member: ${user.name}`,
            user._id,
            user.name
        );

        return SuccessResponse(res, 'Staff permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting staff permanently', error.message, 400);
    }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff, getDeletedStaff, restoreStaff, permanentDeleteStaff };


