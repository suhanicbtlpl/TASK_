const mongoose = require("mongoose");
const Task = require("../model/Task");
const Staff = require("../model/Staff");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;

    // ✅ Validate required fields
    if (!title || !description || !assignedTo || status === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        message: "Invalid assignedTo ID",
      });
    }

    // ✅ Check if assigned staff exists
    const assignedUser = await Staff.findById(assignedTo);
    console.log(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        message: "Assigned staff not found",
      });
    }

    // ✅ Validate status
    if (!["Pending", "InProgress", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be pending or InProgress or Completed",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.body.createdBy || "System",
      status
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status } = req.body;

    // ✅ Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // ✅ If assignedTo is being updated
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          message: "Invalid assignedTo ID",
        });
      }

      const assignedUser = await Staff.findById(assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned staff not found",
        });
      }

      task.assignedTo = assignedTo;
    }

    // ✅ If status is being updated
    if (status) {
      if (!["Pending", "InProgress", "Completed"].includes(status)) {
        return res.status(400).json({
          message: "Status must be Pending, InProgress or Completed",
        });
      }

      task.status = status;
    }

    // ✅ Optional updates
    if (title) task.title = title;
    if (description) task.description = description;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};