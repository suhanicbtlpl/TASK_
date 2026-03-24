const BaseService = require('./BaseService');
const Project = require('../models/Project');

class ProjectService extends BaseService {
    constructor() {
        super(Project);
    }

    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['projectName', 'clientName'],
            populate: [
                { path: 'createdBy', select: 'name' },
                { path: 'projectManager', select: 'name email' },
                { path: 'assignedStaff', select: 'name email' }
            ]
        });
    }

}

module.exports = new ProjectService();
