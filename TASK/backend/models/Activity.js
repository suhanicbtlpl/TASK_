const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN', 'LOGOUT', 'UPLOAD', 'DOWNLOAD', 'PERMANENT_DELETE']
    },
    module: {
        type: String,
        required: true,
        enum: ['Staff', 'Role', 'Project', 'Task', 'Document', 'Auth','Issue']
    },
    details: {
        type: String
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    targetName: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
