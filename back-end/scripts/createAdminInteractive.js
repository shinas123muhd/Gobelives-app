import mongoose from "mongoose";
import User from "../models/User.model.js";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

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

// Create admin user with custom credentials
const createAdminUser = async (userData) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: userData.email }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || "",
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

    console.log("\n🎉 Admin user created successfully!");
    console.log("📧 Email:", userData.email);
    console.log("🔑 Password:", userData.password);
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
  console.log("🚀 Admin User Creation Script");
  console.log("=============================\n");

  try {
    await connectDB();

    // Get user input
    const firstName = await askQuestion("Enter first name (default: Admin): ");
    const lastName = await askQuestion("Enter last name (default: User): ");
    const email = await askQuestion(
      "Enter email (default: admin@gobelives.com): "
    );
    const password = await askQuestion(
      "Enter password (default: Admin123!@#): "
    );
    const phone = await askQuestion("Enter phone number (optional): ");

    // Use defaults if empty
    const userData = {
      firstName: firstName.trim() || "Admin",
      lastName: lastName.trim() || "User",
      email: email.trim() || "admin@gobelives.com",
      password: password.trim() || "Admin123!@#",
      phone: phone.trim() || "",
    };

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(userData.email)) {
      console.error("❌ Invalid email format!");
      process.exit(1);
    }

    // Validate password length
    if (userData.password.length < 6) {
      console.error("❌ Password must be at least 6 characters long!");
      process.exit(1);
    }

    console.log("\n📝 Creating admin user with the following details:");
    console.log(`👤 Name: ${userData.firstName} ${userData.lastName}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`📱 Phone: ${userData.phone || "Not provided"}`);

    await createAdminUser(userData);
  } catch (error) {
    console.error("❌ Script error:", error.message);
  } finally {
    // Close readline interface and database connection
    rl.close();
    await mongoose.connection.close();
    console.log("\n✅ Script completed!");
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  rl.close();
  process.exit(1);
});

// Run the script
main();
