const bcrypt = require("bcryptjs");
const Staff = require("../model/Staff");
const Role = require("../model/Role");

const superAdmin = async () => {
  try {
    const existingAdmin = await Staff.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("SuperAdmin already exists");
      return;
    }

    // Create SuperAdmin role if not exists
    let role = await Role.findOne({ name: "SuperAdmin" });

    if (!role) {
      role = await Role.create({
        name: "SuperAdmin",
        permissions: [],
        status: 1
        });
      console.log("SuperAdmin role created");
    }

    // const hashedPassword = await bcrypt.hash("123456", 10);

    await Staff.create({
      name: "Super Admin",
      phoneNo: "9999999999",
      email: "admin@gmail.com",
      password: 123456,
      role: role._id
    });

    console.log("SuperAdmin user created");

  } catch (error) {
    console.error("Error seeding SuperAdmin:", error.message);
  }
};

module.exports = superAdmin;