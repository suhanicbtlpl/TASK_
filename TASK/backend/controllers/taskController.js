const TaskService = require('../services/TaskService');
const ActivityService = require('../services/ActivityService');
const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get all tasks with search and pagination
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await TaskService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Tasks retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching tasks', error.message);
    }
};

// @desc    Get tasks by project
// @route   GET /api/v1/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
    try {
        // Special case: direct service model access for specific query or add method to TaskService
        const tasks = await TaskService.model.find({ 
            projectId: req.params.projectId, 
            isDeleted: false 
        }).populate('assignedTo', 'name email');
        return SuccessResponse(res, 'Project tasks retrieved successfully', tasks);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching project tasks', error.message);
    }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const task = await TaskService.createTask({
            ...req.body,
            createdBy: req.user._id
        });

        await ActivityService.logActivity(
            req.user._id, 
            'CREATE', 
            'Task', 
            `Created task: ${task.taskTitle}`, 
            task._id, 
            task.taskTitle
        );

        // Notify assigned staff
        if (task.assignedStaff && task.assignedStaff.length > 0) {
            const notifications = task.assignedStaff.map(staffId => ({
                recipient: staffId,
                sender: req.user._id,
                type: 'TASK_ASSIGNED',
                title: 'New Task Assigned',
                message: `You have been assigned a new task: ${task.taskTitle}`,
                link: `/tasks`
            }));
            await Promise.all(notifications.map(n => NotificationService.createNotification(n)));
        }

        return SuccessResponse(res, 'Task created successfully', task, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating task', error.message, 400);
    }
};

// @desc    Update task status or details
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await TaskService.update(req.params.id, req.body);
        if (!task) return ErrorResponse(res, 'Task not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'UPDATE', 
            'Task', 
            `Updated task: ${task.taskTitle}`, 
            task._id, 
            task.taskTitle
        );

        return SuccessResponse(res, 'Task updated successfully', task);
    } catch (error) {
        return ErrorResponse(res, 'Error updating task', error.message, 400);
    }
};

// @desc    Soft delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await TaskService.softDelete(req.params.id);
        if (!task) return ErrorResponse(res, 'Task not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'DELETE', 
            'Task', 
            `Soft deleted task: ${task.taskTitle}`, 
            task._id, 
            task.taskTitle
        );

        return SuccessResponse(res, 'Task soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting task', error.message, 400);
    }
};

// @desc    Get deleted tasks
// @route   GET /api/v1/tasks/deleted
// @access  Private/Admin
const getDeletedTasks = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await TaskService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted tasks retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted tasks', error.message);
    }
};

// @desc    Restore task
// @route   PUT /api/v1/tasks/:id/restore
// @access  Private/Admin
const restoreTask = async (req, res) => {
    try {
        const task = await TaskService.restore(req.params.id);
        if (!task) return ErrorResponse(res, 'Task not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'RESTORE', 
            'Task', 
            `Restored task: ${task.taskTitle}`, 
            task._id, 
            task.taskTitle
        );

        return SuccessResponse(res, 'Task restored successfully', task);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring task', error.message, 400);
    }
};

// @desc    Permanent delete task
// @route   DELETE /api/v1/tasks/:id/permanent
// @access  Private/Admin
const permanentDeleteTask = async (req, res) => {
    try {
        const task = await TaskService.permanentDelete(req.params.id);
        if (!task) return ErrorResponse(res, 'Task not found or not in Recycle Bin', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'PERMANENT_DELETE', 
            'Task', 
            `Permanently deleted task: ${task.taskTitle}`, 
            task._id, 
            task.taskTitle
        );

        return SuccessResponse(res, 'Task permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting task permanently', error.message, 400);
    }
};

module.exports = { getTasks, getTasksByProject, createTask, updateTask, deleteTask, getDeletedTasks, restoreTask, permanentDeleteTask };


