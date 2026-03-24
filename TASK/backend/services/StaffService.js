const BaseService = require('./BaseService');
const User = require('../models/User');

/**
 * Service for managing Staff (User) data operations.
 * Extends BaseService to inherit standard CRUD functionality.
 */
class StaffService extends BaseService {
    constructor() {
        super(User);
    }

    /**
     * Retrieves all staff members with specific search fields and populated role.
     * @param {Object} params - Query parameters for filtering and pagination.
     * @returns {Promise<Object>} The paginated result set.
     */
    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['name', 'email', 'mobileNumber'],
            populate: [{ path: 'role', select: 'roleName' }]
        });
    }
}

module.exports = new StaffService();
