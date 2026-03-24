const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get current user notifications
// @route   GET /api/v1/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await NotificationService.getNotifications(req.user._id);
        return SuccessResponse(res, 'Notifications retrieved', notifications);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching notifications', error.message);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
const markRead = async (req, res) => {
    try {
        const notification = await NotificationService.markAsRead(req.params.id);
        return SuccessResponse(res, 'Notification marked as read', notification);
    } catch (error) {
        return ErrorResponse(res, 'Error marking notification as read', error.message);
    }
};

// @desc    Mark all as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
const markAllRead = async (req, res) => {
    try {
        await NotificationService.markAllAsRead(req.user._id);
        return SuccessResponse(res, 'All notifications marked as read');
    } catch (error) {
        return ErrorResponse(res, 'Error marking all as read', error.message);
    }
};

module.exports = { getMyNotifications, markRead, markAllRead };
