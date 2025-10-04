import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import config from "./config/index.js";
import passport from "./config/passport.js";

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models to register them with Mongoose
import "./models/User.model.js";
import "./models/Property.model.js";
import "./models/Category.model.js";
import "./models/Package.model.js";
import "./models/Review.model.js";
import "./models/Booking.model.js";
import "./models/Coupon.model.js";
import "./models/Hotel.model.js";
import "./models/Blogs.model.js";
import "./models/Gallery.model.js";

// Import routes
import propertyRoutes from "./routes/property.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import categoryPublicRoutes from "./routes/categoryPublic.routes.js";
import packageRoutes from "./routes/package.routes.js";
import packagePublicRoutes from "./routes/packagePublic.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blogs.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import reviewRoutes from "./routes/review.routes.js";

// Import middleware
import { errorHandler } from "./middleware/error.middleware.js";

// Import Swagger
import { specs, swaggerUi } from "./config/swagger.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (should be applied early)
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Passport
app.use(passport.initialize());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "GoBelives API Documentation",
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/categories", categoryPublicRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/packages", packagePublicRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/reviews", reviewRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server gracefully");
  await mongoose.connection.close();
  process.exit(0);
});

// Start the application
startServer();

export default app;
