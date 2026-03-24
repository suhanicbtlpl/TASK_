const Activity = require('../models/Activity');
const BaseService = require('./BaseService');

class ActivityService extends BaseService {
    constructor() {
        super(Activity);
    }

    async logActivity(user, action, module, details, targetId, targetName) {
        try {
            return await this.create({
                user,
                action,
                module,
                details,
                targetId,
                targetName
            });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    async getRecentActivity(limit = 10) {
        return await Activity.find()
            .populate('user', 'name profilePhoto')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}

module.exports = new ActivityService();
