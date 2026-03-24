const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('-password').populate({
                path: 'role',
                populate: { path: 'permissions.permission' }
            });


            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const userObj = user.toObject();

            if (userObj.role && userObj.role.permissions) {
                const flattenedPermissions = [];
                userObj.role.permissions.forEach(p => {
                    if (p.permission && p.actions) {
                        const name = p.permission.permissionName;
                        if (p.actions.create) flattenedPermissions.push(`${name}_CREATE`);
                        if (p.actions.read) flattenedPermissions.push(`${name}_READ`);
                        if (p.actions.update) flattenedPermissions.push(`${name}_UPDATE`);
                        if (p.actions.delete) flattenedPermissions.push(`${name}_DELETE`);
                    }
                });
                
                // Assign flattened strings back to role object for middleware check
                userObj.role.permissions = flattenedPermissions;
            }

            req.user = userObj;
            next();
            return; // Exit function after next()
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = { protect };
