const RoleService = require('../services/RoleService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Create a new role
// @route   POST /api/v1/roles
// @access  Private/Admin
const createRole = async (req, res) => {
    try {
        const { roleName, permissions, status } = req.body;
        const roleExists = await RoleService.model.findOne({ roleName, isDeleted: false });
        if (roleExists) {
            return ErrorResponse(res, 'Role already exists', null, 400);
        }

        const role = await RoleService.create({ roleName, permissions, status });
        return SuccessResponse(res, 'Role created successfully', role, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating role', error.message, 400);
    }
};

// @desc    Get all roles with search and pagination
// @route   GET /api/v1/roles
// @access  Private
const getRoles = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await RoleService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Roles retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching roles', error.message);
    }
};

// @desc    Update role
// @route   PUT /api/v1/roles/:id
// @access  Private/Admin
const updateRole = async (req, res) => {
    try {
        const role = await RoleService.update(req.params.id, req.body);
        if (!role) {
            return ErrorResponse(res, 'Role not found', null, 404);
        }
        return SuccessResponse(res, 'Role updated successfully', role);
    } catch (error) {
        return ErrorResponse(res, 'Error updating role', error.message, 400);
    }
};

// @desc    Soft delete role
// @route   DELETE /api/v1/roles/:id
// @access  Private/Admin
const deleteRole = async (req, res) => {
    try {
        const role = await RoleService.softDelete(req.params.id);
        if (!role) {
            return ErrorResponse(res, 'Role not found', null, 404);
        }
        return SuccessResponse(res, 'Role soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting role', error.message, 400);
    }
};

// @desc    Get deleted roles
// @route   GET /api/v1/roles/deleted
// @access  Private/Admin
const getDeletedRoles = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await RoleService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted roles retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted roles', error.message);
    }
};

// @desc    Restore role
// @route   PUT /api/v1/roles/:id/restore
// @access  Private/Admin
const restoreRole = async (req, res) => {
    try {
        const role = await RoleService.restore(req.params.id);
        if (!role) return ErrorResponse(res, 'Role not found', null, 404);
        return SuccessResponse(res, 'Role restored successfully', role);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring role', error.message, 400);
    }
};

// @desc    Permanent delete role
// @route   DELETE /api/v1/roles/:id/permanent
// @access  Private/Admin
const permanentDeleteRole = async (req, res) => {
    try {
        const role = await RoleService.permanentDelete(req.params.id);
        if (!role) return ErrorResponse(res, 'Role not found or not in Recycle Bin', null, 404);
        return SuccessResponse(res, 'Role permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting role permanently', error.message, 400);
    }
};

module.exports = { createRole, getRoles, updateRole, deleteRole, getDeletedRoles, restoreRole, permanentDeleteRole };


