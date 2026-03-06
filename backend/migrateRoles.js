/**
 * One-time migration: clear old ObjectId permissions from all roles in MongoDB.
 * Run once with: node migrateRoles.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    status: Number,
    permissions: { type: [String], default: [] }
});
const Role = mongoose.model("Role", roleSchema);

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    const roles = await Role.find();
    for (const role of roles) {
        // Keep only plain strings (e.g. "CREATE_STAFF"), drop ObjectIds
        const cleaned = (role.permissions || []).filter(p => typeof p === "string" && p.includes("_"));
        role.permissions = cleaned;
        await role.save();
        console.log(`Migrated "${role.name}" -> ${JSON.stringify(cleaned)}`);
    }

    await mongoose.disconnect();
    console.log("Migration complete.");
}

migrate().catch(err => { console.error(err); process.exit(1); });
