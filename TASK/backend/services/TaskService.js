const BaseService = require('./BaseService');
const Task = require('../models/Task');

const Project = require('../models/Project');

class TaskService extends BaseService {
    constructor() {
        super(Task);
    }

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

    async createTask(data) {
        const task = await this.model.create(data);
        if (task && data.projectId) {
            await Project.findByIdAndUpdate(data.projectId, { $push: { tasks: task._id } });
        }
        return task;
    }

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

    async restore(id) {
        const task = await this.model.findOneAndUpdate(
            { _id: id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );
        if (task && task.projectId) {
            // Check if project still exists and push task back
            await Project.findByIdAndUpdate(task.projectId, { $addToSet: { tasks: task._id } });
        }
        return task;
    }

}


module.exports = new TaskService();
