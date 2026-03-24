const IssueService = require('../services/IssueService');
const ActivityService = require('../services/ActivityService');
const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get all issues
// @route   GET /api/v1/issues
// @access  Private
const getIssues = async (req, res) => {
    try {
        const result = await IssueService.getAll(req.query);
        return SuccessResponse(res, 'Issues retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching issues', error.message);
    }
};

// @desc    Create new issue
// @route   POST /api/v1/issues
// @access  Private
const createIssue = async (req, res) => {
    try {
        req.body.reportedBy = req.user._id;
        const issue = await IssueService.create(req.body);

        await ActivityService.logActivity(
            req.user._id, 
            'CREATE', 
            'Issue', 
            `Reported issue: ${issue.title}`, 
            issue._id, 
            issue.title
        );

        if (issue.assignedTo) {
            await NotificationService.createNotification({
                recipient: issue.assignedTo,
                sender: req.user._id,
                type: 'ISSUE_ASSIGNED',
                title: 'New Issue Assigned',
                message: `You have been assigned the issue: ${issue.title}`,
                link: `/issues`
            });
        }

        return SuccessResponse(res, 'Issue created successfully', issue, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating issue', error.message, 400);
    }
};

// @desc    Update issue
// @route   PUT /api/v1/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
    try {
        const oldIssue = await IssueService.getById(req.params.id);
        const issue = await IssueService.update(req.params.id, req.body);
        if (!issue) return ErrorResponse(res, 'Issue not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'UPDATE', 
            'Issue', 
            `Updated issue: ${issue.title}`, 
            issue._id, 
            issue.title
        );

        // Notify if newly assigned
        if (issue.assignedTo && (!oldIssue.assignedTo || oldIssue.assignedTo.toString() !== issue.assignedTo.toString())) {
            await NotificationService.createNotification({
                recipient: issue.assignedTo,
                sender: req.user._id,
                type: 'ISSUE_ASSIGNED',
                title: 'New Issue Assigned',
                message: `You have been assigned the issue: ${issue.title}`,
                link: `/issues`
            });
        }

        return SuccessResponse(res, 'Issue updated successfully', issue);
    } catch (error) {
        return ErrorResponse(res, 'Error updating issue', error.message, 400);
    }
};

// @desc    Soft delete issue
// @route   DELETE /api/v1/issues/:id
// @access  Private
const deleteIssue = async (req, res) => {
    try {
        const issue = await IssueService.softDelete(req.params.id);
        if (!issue) return ErrorResponse(res, 'Issue not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'DELETE', 
            'Issue', 
            `Soft deleted issue: ${issue.title}`, 
            issue._id, 
            issue.title
        );

        return SuccessResponse(res, 'Issue deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting issue', error.message, 400);
    }
};

// @desc    Get deleted issues
// @route   GET /api/v1/issues/deleted
// @access  Private/Admin
const getDeletedIssues = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await IssueService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted issues retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted issues', error.message);
    }
};

// @desc    Restore issue
// @route   PUT /api/v1/issues/:id/restore
// @access  Private/Admin
const restoreIssue = async (req, res) => {
    try {
        const issue = await IssueService.restore(req.params.id);
        if (!issue) return ErrorResponse(res, 'Issue not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'RESTORE', 
            'Issue', 
            `Restored issue: ${issue.title}`, 
            issue._id, 
            issue.title
        );

        return SuccessResponse(res, 'Issue restored successfully', issue);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring issue', error.message, 400);
    }
};

// @desc    Permanent delete issue
// @route   DELETE /api/v1/issues/:id/permanent
// @access  Private/Admin
const permanentDeleteIssue = async (req, res) => {
    try {
        const issue = await IssueService.permanentDelete(req.params.id);
        if (!issue) return ErrorResponse(res, 'Issue not found or not in Recycle Bin', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'PERMANENT_DELETE', 
            'Issue', 
            `Permanently deleted issue: ${issue.title}`, 
            issue._id, 
            issue.title
        );

        return SuccessResponse(res, 'Issue permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting issue permanently', error.message, 400);
    }
};

module.exports = { getIssues, createIssue, updateIssue, deleteIssue, getDeletedIssues, restoreIssue, permanentDeleteIssue };
