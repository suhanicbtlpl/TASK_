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

            // Flatten permissions for easy access in checkPermission middleware
            const userObj = user.toObject();
            if (userObj.role) {
                userObj.role.permissions = user.getFlattenedPermissions();
            }

            req.user = userObj;
            next();
            return;
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
