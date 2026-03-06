require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const superAdmin = require("./config/superAdmin");

const PORT = 3001;

const startServer = async () => {
  await connectDB();          // Wait for DB
  await superAdmin();     // Create first admin if not exists

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();