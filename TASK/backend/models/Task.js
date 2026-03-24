const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Review', 'Completed'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    subtasks: [{
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {

    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
