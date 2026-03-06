const Staff = require("../model/Staff");
const Role = require("../model/Role");

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { name, phoneNo, email, password, role } = req.body;

    // Validation
    if (!name || !phoneNo || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    // Check duplicate email
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Create staff
    const staff = await Staff.create({
      name,
      phoneNo,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "Staff created successfully",
      staffId: staff._id,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNo, email, password, role } = req.body;

  if (!name || !phoneNo || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  // Create staff
  const staff = await Staff.findByIdAndUpdate(id, {
    name,
    phoneNo,
    email,
    password,
    role,
  });

  res.status(201).json({
    message: "Staff updated successfully",
    staffId: staff._id,
  });
}

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndDelete(id);
    if (staff) {
      res.status(201).json({
        message: "Staff deleted successfully",
        staffId: staff._id
      })
    }
    else {
      res.status(404).json({
        message: "Id not found"
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}