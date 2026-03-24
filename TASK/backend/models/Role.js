const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    permissions: [{
        permission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission',
            required: true
        },
        actions: {
            create: { type: Boolean, default: false },
            read: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {

    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
