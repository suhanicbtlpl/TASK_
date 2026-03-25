const IssueService = require('../services/IssueService');
const ActivityService = require('../services/ActivityService');
const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

/**
 * Get all issues with search and pagination.
 */
const getIssues = async (req, res) => {
    try {
        const { page, limit, search, projectId } = req.query;
        const filter = projectId ? { projectId } : {};
        const result = await IssueService.getAll({ page, limit, search, filter });
        return SuccessResponse(res, 'Issues retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching issues', error.message);
    }
};

/**
 * Report a new issue and notify assigned staff.
 */
const createIssue = async (req, res) => {
    try {
        const issueData = {
            ...req.body,
            reportedBy: req.user._id
        };
        const issue = await IssueService.create(issueData);

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

/**
 * Update issue details and notify if ownership changes.
 */
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
        const wasNewlyAssigned = issue.assignedTo && 
            (!oldIssue.assignedTo || oldIssue.assignedTo.toString() !== issue.assignedTo.toString());
            
        if (wasNewlyAssigned) {
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

/**
 * Soft delete an issue.
 */
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

/**
 * Get issues from Recycle Bin.
 */
const getDeletedIssues = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await IssueService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted issues retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted issues', error.message);
    }
};

/**
 * Restore an issue from Recycle Bin.
 */
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

/**
 * Permanently delete an issue.
 */
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

module.exports = { 
    getIssues, 
    createIssue, 
    updateIssue, 
    deleteIssue, 
    getDeletedIssues, 
    restoreIssue, 
    permanentDeleteIssue 
};
