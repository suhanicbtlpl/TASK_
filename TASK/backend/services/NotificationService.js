const Notification = require('../models/Notification');
const BaseService = require('./BaseService');

class NotificationService extends BaseService {
    constructor() {
        super(Notification);
    }

    async getNotifications(userId, params = {}) {
        return await this.getAll({
            ...params,
            recipient: userId,
            sort: { createdAt: -1 }
        });
    }

    async markAsRead(notificationId) {
        return await this.update(notificationId, { isRead: true });
    }

    async markAllAsRead(userId) {
        return await Notification.updateMany({ recipient: userId }, { isRead: true });
    }

    async createNotification(data) {
        return await this.create(data);
    }
}

module.exports = new NotificationService();
