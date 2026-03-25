const BaseService = require('./BaseService');
const Company = require('../models/Company');

class CompanyService extends BaseService {
    constructor() {
        super(Company);
    }

    async getAll(params = {}) {
        return super.getAll({
            ...params,
            searchFields: ['companyName', 'address', 'phone'],
            populate: [{ path: 'owner', select: 'name email' }]
        });
    }

    async getById(id) {
        return super.getById(id, [{ path: 'owner', select: 'name email' }]);
    }
}

module.exports = new CompanyService();
