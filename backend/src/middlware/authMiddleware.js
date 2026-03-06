const jwt = require("jsonwebtoken");
const Staff = require("../model/Staff");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("heyyyyy");
    
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Staff.findById(decoded.id).populate("role").populate("role.permissions");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;