const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'No role assigned' });
        }

        const hasPermission = req.user.role.permissions.includes(permission);

        if (!hasPermission) {
            return res.status(403).json({ message: `Access denied: Required permission ${permission}` });
        }

        next();
    };
};

module.exports = { checkPermission };
