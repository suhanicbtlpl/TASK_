const StaffService = require('../services/StaffService');
const ActivityService = require('../services/ActivityService');
const EmailService = require('../services/EmailService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

/**
 * Retrieves all staff members with search and pagination.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getStaff = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await StaffService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Staff retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching staff', error.message);
    }
};

/**
 * Creates a new staff member and sends a welcome email.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createStaff = async (req, res) => {
    try {
        const { name, email, password, mobileNumber, role } = req.body;
        
        // Check for existing user (including soft-deleted)
        const existing = await StaffService.model.findOne({ email });
        if (existing) {
            if (existing.isDeleted) {
                return ErrorResponse(res, 'A user with this email exists in the Recycle Bin. Please restore it or use a different email.', null, 400);
            }
            return ErrorResponse(res, 'User with this email already exists', null, 400);
        }

        const user = await StaffService.create({ name, email, password, mobileNumber, role });
        const populatedUser = await StaffService.model.findById(user._id).populate('role');

        // Async welcome email
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

/**
 * Updates an existing staff member's details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Soft deletes a staff member.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Retrieves soft-deleted staff members from the Recycle Bin.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getDeletedStaff = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await StaffService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted staff retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted staff', error.message);
    }
};

/**
 * Restores a soft-deleted staff member.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Permanently deletes a staff member record.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

module.exports = { 
    getStaff, 
    createStaff, 
    updateStaff, 
    deleteStaff, 
    getDeletedStaff, 
    restoreStaff, 
    permanentDeleteStaff 
};


