const BaseService = require('./BaseService');
const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Service for managing Task data.
 */
class TaskService extends BaseService {
    constructor() {
        super(Task);
    }

    /**
     * Get all tasks with automatic population of related fields.
     */
    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['taskTitle'],
            populate: [
                { path: 'projectId', select: 'projectName' },
                { path: 'assignedTo', select: 'name email profilePhoto' },
                { path: 'createdBy', select: 'name' }
            ]
        });
    }

    /**
     * Create a task and link it to a project.
     */
    async createTask(data) {
        const task = await this.model.create(data);
        if (task && data.projectId) {
            await Project.findByIdAndUpdate(data.projectId, { $push: { tasks: task._id } });
        }
        return task;
    }

    /**
     * Soft delete a task and remove it from the project's task list.
     */
    async softDelete(id) {
        const task = await this.model.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (task && task.projectId) {
            await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: task._id } });
        }
        return task;
    }

    /**
     * Restore a deleted task and add it back to the project.
     */
    async restore(id) {
        const task = await this.model.findOneAndUpdate(
            { _id: id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );
        if (task && task.projectId) {
            await Project.findByIdAndUpdate(task.projectId, { $addToSet: { tasks: task._id } });
        }
        return task;
    }
}

module.exports = new TaskService();
