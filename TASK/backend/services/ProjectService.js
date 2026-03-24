const BaseService = require('./BaseService');
const Project = require('../models/Project');

/**
 * Service for managing Project data.
 */
class ProjectService extends BaseService {
    constructor() {
        super(Project);
    }

    /**
     * Get all projects with automatic population of managers and staff.
     */
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
