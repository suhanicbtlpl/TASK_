const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Create Issue Permission if not exists
        let issuePermission = await Permission.findOne({ permissionName: 'Issue' });
        if (!issuePermission) {
            issuePermission = await Permission.create({ permissionName: 'Issue' });
            console.log('Issue Permission Created');
        } else {
            console.log('Issue Permission already exists');
        }

        // 2. Add to Admin Role
        const adminRole = await Role.findOne({ roleName: 'Admin' });
        if (adminRole) {
            const hasPermission = adminRole.permissions.some(p => p.permission.toString() === issuePermission._id.toString());
            if (!hasPermission) {
                adminRole.permissions.push({
                    permission: issuePermission._id,
                    actions: { create: true, read: true, update: true, delete: true }
                });
                await adminRole.save();
                console.log('Issue Permission added to Admin Role');
            } else {
                console.log('Admin Role already has Issue Permission');
            }
        } else {
            console.log('Admin Role not found');
        }

        console.log('Migration completed');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
