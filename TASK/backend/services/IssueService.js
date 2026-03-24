const BaseService = require('./BaseService');
const Issue = require('../models/Issue');

/**
 * Service for managing Issue data.
 */
class IssueService extends BaseService {
    constructor() {
        super(Issue);
    }

    /**
     * Get all issues with automatic population of related entities.
     */
    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['title', 'description'],
            populate: [
                { path: 'projectId', select: 'projectName' },
                { path: 'taskId', select: 'taskTitle' },
                { path: 'reportedBy', select: 'name email' },
                { path: 'assignedTo', select: 'name email' }
            ]
        });
    }
}

module.exports = new IssueService();
