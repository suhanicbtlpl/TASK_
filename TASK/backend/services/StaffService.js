const BaseService = require('./BaseService');
const User = require('../models/User');

class StaffService extends BaseService {
    constructor() {
        super(User);
    }

    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['name', 'email', 'mobileNumber'],
            populate: [{ path: 'role', select: 'roleName' }]
        });
    }
}

module.exports = new StaffService();
