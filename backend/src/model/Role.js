const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },

  // ✅ ADDED THIS
  permissions: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("Role", roleSchema);