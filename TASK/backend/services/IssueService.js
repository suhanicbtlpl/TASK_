const BaseService = require('./BaseService');
const Issue = require('../models/Issue');

class IssueService extends BaseService {
    constructor() {
        super(Issue);
    }

    async getAll(query) {
        const { page = 1, limit = 10, search, projectId, status } = query;
        const filter = { isDeleted: false };
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const data = await this.model.find(filter)
            .populate('projectId', 'projectName')
            .populate('taskId', 'taskTitle')
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await this.model.countDocuments(filter);

        return {
            data,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        };
    }
}

module.exports = new IssueService();
