const TaskService = require('../services/TaskService');
const ActivityService = require('../services/ActivityService');
const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

/**
 * Get all tasks with search and pagination.
 */
const getTasks = async (req, res) => {
    try {
        const { page, limit, search, projectId } = req.query;
        const filter = projectId ? { projectId } : {};

        const result = await TaskService.getAll({ page, limit, search, filter });
        return SuccessResponse(res, 'Tasks retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching tasks', error.message);
    }
};

/**
 * Get all active tasks for a specific project.
 */
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await TaskService.model.find({ 
            projectId: req.params.projectId, 
            isDeleted: false 
        }).populate('assignedTo', 'name email');
        return SuccessResponse(res, 'Project tasks retrieved successfully', tasks);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching project tasks', error.message);
    }
};

/**
 * Create a new task and notify the assigned staff.
 */
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
        if (task.assignedTo) {
            await NotificationService.createNotification({
                recipient: task.assignedTo,
                sender: req.user._id,
                type: 'TASK_ASSIGNED',
                title: 'New Task Assigned',
                message: `You have been assigned a new task: ${task.taskTitle}`,
                link: `/tasks`
            });
        }

        return SuccessResponse(res, 'Task created successfully', task, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating task', error.message, 400);
    }
};

/**
 * Update task details or status.
 */
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

/**
 * Soft delete a task.
 */
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

/**
 * Get tasks from Recycle Bin.
 */
const getDeletedTasks = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await TaskService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted tasks retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted tasks', error.message);
    }
};

/**
 * Restore a task from Recycle Bin.
 */
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

/**
 * Permanently delete a task.
 */
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

module.exports = { 
    getTasks, 
    getTasksByProject, 
    createTask, 
    updateTask, 
    deleteTask, 
    getDeletedTasks, 
    restoreTask, 
    permanentDeleteTask 
};


