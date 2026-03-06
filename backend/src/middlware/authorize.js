// module.exports = (moduleName, action) => {
//   return (req, res, next) => {

//     const permissions = req.user.role.permissions;

//     const hasPermission = permissions.some(permission =>
//       permission.name === moduleName &&
//       permission.value === action &&
//       permission.status === 1
//     );

//     if (!hasPermission) {
//       return res.status(403).json({
//         message: `You don't have permission to ${action} ${moduleName}`
//       });
//     }

//     next();
//   };
// };

module.exports = (moduleName, action) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Unauthorized access"
      });
    }

    // ✅ SuperAdmin bypass
    if (req.user.role.name === "SuperAdmin") {
      return next();
    }

    const permissions = req.user.role.permissions || [];

    const hasPermission = permissions.some(permission =>
      permission.name === moduleName &&
      permission.value === action &&
      permission.status === 1
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: `You don't have permission to ${action} ${moduleName}`
      });
    }

    next();
  };
};