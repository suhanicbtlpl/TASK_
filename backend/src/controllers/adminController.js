const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const Staff = require("../model/Staff")
// REGISTER
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      adminId: admin._id,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// LOGIN
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const admin = await Admin.findOne({ username });
//     if (!admin) {
//       return res.status(400).json({ message: "Admin not found" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: admin._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.cookie("token", token, {
//       maxAge: 60 * 60 * 1000 // 1 hour
//     });

//     res.json({ message: "Login successful" });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Staff.findOne({ email })
      .populate({
        path: "role",
        populate: {
          path: "permissions"
        }
      });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);

    if (user.email !== email || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({
      message: "Login successful",
      staff: user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};