const BaseService = require('./BaseService');
const Permission = require('../models/Permission');

/**
 * Service for managing Permission data.
 */
class PermissionService extends BaseService {
    constructor() {
        super(Permission);
    }

    /**
     * Get all permissions with configured search fields.
     */
    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['permissionName']
        });
    }
}

module.exports = new PermissionService();
