const BaseService = require('./BaseService');
const Permission = require('../models/Permission');

class PermissionService extends BaseService {
    constructor() {
        super(Permission);
    }

    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['permissionName']
        });
    }
}

module.exports = new PermissionService();
