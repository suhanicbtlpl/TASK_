const express = require("express");
const router = express.Router();
const authorize = require("../middlware/authorize");
const authMiddleware = require("../middlware/authMiddleware");

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminController");

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const { getTasks, createTask, deleteTask, updateTask } = require("../controllers/taskController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

//role
router.get("/getRoles", getRoles);
router.post("/createRole", createRole);
router.put("/updateRole/:id", updateRole);
router.delete("/deleteRole/:id", deleteRole);

//staff
router.get("/getStaff", getStaff);
router.post("/createStaff", createStaff);
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id", deleteStaff);
//task
router.get("/getTasks", getTasks);
router.post("/createTask", createTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

module.exports = router;