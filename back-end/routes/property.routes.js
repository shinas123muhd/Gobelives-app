import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  toggleFeaturedProperty,
} from "../controllers/property.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes are protected and require admin role
router.use(authMiddleware, adminMiddleware);

// Configure multer for file uploads
const multerUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.route("/").post(multerUpload, createProperty).get(getProperties);

router
  .route("/:id")
  .get(getProperty)
  .put(multerUpload, updateProperty)
  .delete(deleteProperty);

router.route("/:id/status").patch(updatePropertyStatus);

router.route("/:id/featured").patch(toggleFeaturedProperty);

export default router;
