const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const adminRoutes = require("./Routes/adminRoute");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/admin", adminRoutes);

module.exports = app;