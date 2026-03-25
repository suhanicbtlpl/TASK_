const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const bcrypt = require('bcryptjs');

dotenv.config();

const permissionsToSeed = [
    { name: 'Staff' },
    { name: 'Role' },
    { name: 'Project' },
    { name: 'Task' },
    { name: 'Permission' },
    { name: 'Document' },
    { name: 'Issue' },
    { name: 'Company' },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Role.deleteMany();
        await Permission.deleteMany();
        console.log('Existing data cleared');

        // 1. Seed Permissions (Simple names)
        const createdPermissions = await Permission.insertMany(
            permissionsToSeed.map(p => ({
                permissionName: p.name
            }))
        );
        console.log(`${createdPermissions.length} Permissions Created`);

        // 2. Create Admin Role with all actions for all permissions
        const adminRole = await Role.create({
            roleName: 'Admin',
            permissions: createdPermissions.map(p => ({
                permission: p._id,
                actions: { create: true, read: true, update: true, delete: true }
            }))
        });
        console.log('Admin Role Created');

        // 3. Create Admin User
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: adminPassword,
            mobileNumber: '1234567890',
            role: adminRole._id
        });
        console.log('Admin User Created');
        console.log('Email: admin@example.com / Password: admin123');

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();

