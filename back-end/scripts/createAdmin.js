import mongoose from "mongoose";
import User from "../models/User.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/gobelives"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: "admin@gobelives.com" }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@gobelives.com",
      password: "Admin123!@#", // You can change this password
      phone: "+1234567890",
      role: "admin",
      isActive: true,
      isEmailVerified: true,
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        language: "en",
      },
    });

    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email: admin@gobelives.com");
    console.log("🔑 Password: Admin123!@#");
    console.log("👤 Role: admin");
    console.log("✅ Email verified: true");
    console.log("🟢 Account active: true");
    console.log("\n💡 You can now login with these credentials!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

// Main function
const main = async () => {
  console.log("🚀 Starting admin user creation script...\n");

  await connectDB();
  await createAdminUser();

  // Close connection
  await mongoose.connection.close();
  console.log("\n✅ Script completed successfully!");
  process.exit(0);
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Run the script
main();
