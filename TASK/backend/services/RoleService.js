const BaseService = require('./BaseService');
const Role = require('../models/Role');

/**
 * Service for managing Role data.
 */
class RoleService extends BaseService {
    constructor() {
        super(Role);
    }

    /**
     * Get all roles with permission population.
     */
    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['roleName'],
            populate: [{ path: 'permissions.permission', select: 'permissionName' }]
        });
    }
}

module.exports = new RoleService();
