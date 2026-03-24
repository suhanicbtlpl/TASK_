const ActivityService = require('../services/ActivityService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get recent activities
// @route   GET /api/v1/activities/recent
// @access  Private
const getRecentActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const activities = await ActivityService.getRecentActivity(limit);
        return SuccessResponse(res, 'Recent activities retrieved successfully', activities);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching recent activities', error.message);
    }
};

module.exports = { getRecentActivities };
