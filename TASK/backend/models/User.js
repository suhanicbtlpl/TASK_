const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },

    profilePhoto: {
        type: String,
        default: ''
    },
    role: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    settings: {
        theme: { type: String, default: 'light', enum: ['light', 'dark'] },
        notifications: {
            email: { type: Boolean, default: true },
            browser: { type: Boolean, default: true }
        }
    },
    lastLogin: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {



    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user permissions as a simple array (e.g., ['Project_READ', 'Task_CREATE'])
userSchema.methods.getFlattenedPermissions = function () {
    const permissions = [];
    if (this.role && this.role.permissions) {
        this.role.permissions.forEach(p => {
            if (p.permission && p.actions) {
                const name = p.permission.permissionName || p.permission;
                const permissionName = typeof name === 'object' ? name.permissionName : name;
                
                if (p.actions.create) permissions.push(`${permissionName}_CREATE`);
                if (p.actions.read) permissions.push(`${permissionName}_READ`);
                if (p.actions.update) permissions.push(`${permissionName}_UPDATE`);
                if (p.actions.delete) permissions.push(`${permissionName}_DELETE`);
            }
        });
    }
    return permissions;
};

module.exports = mongoose.model('User', userSchema);
