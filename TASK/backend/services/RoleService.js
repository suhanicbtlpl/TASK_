const BaseService = require('./BaseService');
const Role = require('../models/Role');

class RoleService extends BaseService {
    constructor() {
        super(Role);
    }

    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['roleName'],
            populate: [{ path: 'permissions.permission', select: 'permissionName' }]
        });
    }
}

module.exports = new RoleService();
