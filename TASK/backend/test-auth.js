const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');

dotenv.config();

const testAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Auth Diagnostic ---');
        console.log('Connecting to:', process.env.MONGO_URI);

        const email = 'admin@example.com';
        const password = 'admin123';

        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            console.log('❌ FAIL: User not found in database.');
            console.log('Did you run "node seeder.js"?');
            process.exit(1);
        }

        console.log('✅ User found:', user.name);
        console.log('✅ Role:', user.role ? user.role.roleName : 'NO ROLE ASSIGNED');

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            console.log('✅ SUCCESS: Password matches.');
        } else {
            console.log('❌ FAIL: Password does NOT match.');
            // Debug bcrypt compare
            const compareDebug = await bcrypt.compare(password, user.password);
            console.log('Direct bcrypt.compare result:', compareDebug);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
    }
};

testAuth();
