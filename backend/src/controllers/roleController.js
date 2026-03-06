const Role = require("../model/Role");

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, status, permissions } = req.body;

    // Validate
    console.log(req.body)
    if (!name || status === undefined) {
      return res.status(400).json({
        message: "Role name and status required",
      });
    }

    // 🔥 FIXED: Proper findOne query
    const existingRole = await Role.findOne({ name });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists",
      });
    }

    const role = await Role.create({
      name,
      status,
      permissions
    });

    res.status(201).json({
      message: "Role created successfully",
      roleId: role._id,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateRole = async (req, res) => {
  try {
    console.log('UpdateRole:', req.body);
    const { id } = req.params;
    const { name, status, permissions } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    if (name !== undefined) role.name = name;
    if (status !== undefined) role.status = status;
    if (permissions !== undefined) role.permissions = permissions;
    await role.save();

    res.status(200).json({
      message: "Role updated successfully",
      role
    });

  } catch (error) {
    console.error('UpdateRole error:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    await Role.findByIdAndDelete(id);

    res.status(200).json({
      message: "Role deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};