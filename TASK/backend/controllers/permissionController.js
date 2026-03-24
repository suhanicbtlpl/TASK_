const PermissionService = require('../services/PermissionService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get all permissions with search and pagination
// @route   GET /api/v1/permissions
// @access  Private/Admin
const getPermissions = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await PermissionService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Permissions retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching permissions', error.message);
    }
};

// @desc    Create new permission
// @route   POST /api/v1/permissions
// @access  Private/Admin
const createPermission = async (req, res) => {
    try {
        const { permissionName } = req.body;
        const permissionExists = await PermissionService.model.findOne({ permissionName, isDeleted: false });
        if (permissionExists) {
            return ErrorResponse(res, 'Permission already exists', null, 400);
        }

        const permission = await PermissionService.create({ permissionName });
        return SuccessResponse(res, 'Permission created successfully', permission, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating permission', error.message, 400);
    }
};

// @desc    Update permission
// @route   PUT /api/v1/permissions/:id
// @access  Private/Admin
const updatePermission = async (req, res) => {
    try {
        const permission = await PermissionService.update(req.params.id, req.body);
        if (!permission) return ErrorResponse(res, 'Permission not found', null, 404);
        return SuccessResponse(res, 'Permission updated successfully', permission);
    } catch (error) {
        return ErrorResponse(res, 'Error updating permission', error.message, 400);
    }
};

// @desc    Soft delete permission
// @route   DELETE /api/v1/permissions/:id
// @access  Private/Admin
const deletePermission = async (req, res) => {
    try {
        const permission = await PermissionService.softDelete(req.params.id);
        if (!permission) return ErrorResponse(res, 'Permission not found', null, 404);
        return SuccessResponse(res, 'Permission soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting permission', error.message, 400);
    }
};

// @desc    Get deleted permissions
// @route   GET /api/v1/permissions/deleted
// @access  Private/Admin
const getDeletedPermissions = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await PermissionService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted permissions retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted permissions', error.message);
    }
};

// @desc    Restore permission
// @route   PUT /api/v1/permissions/:id/restore
// @access  Private/Admin
const restorePermission = async (req, res) => {
    try {
        const permission = await PermissionService.restore(req.params.id);
        if (!permission) return ErrorResponse(res, 'Permission not found', null, 404);
        return SuccessResponse(res, 'Permission restored successfully', permission);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring permission', error.message, 400);
    }
};

// @desc    Permanent delete permission
// @route   DELETE /api/v1/permissions/:id/permanent
// @access  Private/Admin
const permanentDeletePermission = async (req, res) => {
    try {
        const permission = await PermissionService.permanentDelete(req.params.id);
        if (!permission) return ErrorResponse(res, 'Permission not found or not in Recycle Bin', null, 404);
        return SuccessResponse(res, 'Permission permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting permission permanently', error.message, 400);
    }
};

module.exports = { getPermissions, createPermission, updatePermission, deletePermission, getDeletedPermissions, restorePermission, permanentDeletePermission };


