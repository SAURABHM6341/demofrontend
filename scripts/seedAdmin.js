/**
 * Seed script to create admin user
 * Run with: node scripts/seedAdmin.js
 */

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@cargomatters.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@123";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cargomatters";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`Admin user already exists with email: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    // Create admin user
    console.log("Creating admin user...");
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    await Admin.create({
      email: ADMIN_EMAIL,
      passwordHash,
      name: "CargoMatters Admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
