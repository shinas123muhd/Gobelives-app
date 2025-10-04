import Gallery from "../models/Gallery.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Get all images with filters
// @route   GET /api/gallery
// @access  Public
export const getAllImages = async (req, res) => {
  try {
    const {
      search,
      featured,
      tag,
      category,
      dateFrom,
      dateTo,
      visibility,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Featured filter (only apply if it has a valid value)
    if (featured !== undefined && featured !== "" && featured !== null) {
      query.featured = featured === "true";
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Category filter
    if (category) {
      query.categories = { $in: [category] };
    }

    // Visibility filter
    if (visibility) {
      query.visibility = visibility;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Active images only (soft delete)
    query.isActive = true;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Execute query
    const images = await Gallery.find(query)
      .populate({
        path: "uploadedBy",
        select: "firstName lastName email",
        options: { strictPopulate: false },
      })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
};

// @desc    Get single image by ID
// @route   GET /api/gallery/:id
// @access  Public
export const getImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id).populate(
      "uploadedBy",
      "firstName lastName email"
    );

    if (!image || !image.isActive) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Increment view count
    await image.incrementViewCount();

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch image",
      error: error.message,
    });
  }
};

// @desc    Get image by slug
// @route   GET /api/gallery/slug/:slug
// @access  Public
export const getImageBySlug = async (req, res) => {
  try {
    const image = await Gallery.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("uploadedBy", "firstName lastName email");

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Increment view count
    await image.incrementViewCount();

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch image",
      error: error.message,
    });
  }
};

// @desc    Upload new image to gallery
// @route   POST /api/gallery
// @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    const { title, description, tags, categories, featured, visibility } =
      req.body;

    // Handle image upload
    let imageData = {};
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file, "gallery");
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        altText: title || "Gallery image",
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        fileSize: uploadResult.bytes,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Create gallery entry
    const image = await Gallery.create({
      image: imageData,
      title,
      description,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags || "[]"),
      categories: Array.isArray(categories)
        ? categories
        : JSON.parse(categories || "[]"),
      featured: featured || false,
      visibility: visibility || "public",
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

// @desc    Update image details
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const { title, description, tags, categories, featured, visibility } =
      req.body;

    // Handle image replacement if new image is provided
    let imageData = image.image;
    if (req.file) {
      // Delete old image from cloudinary
      if (image.image?.publicId) {
        await deleteFromCloudinary(image.image.publicId);
      }

      const uploadResult = await uploadOnCloudinary(req.file, "gallery");
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        altText: title || image.title,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        fileSize: uploadResult.bytes,
      };
    }

    // Update image fields
    image.title = title || image.title;
    image.description =
      description !== undefined ? description : image.description;
    image.tags = tags
      ? Array.isArray(tags)
        ? tags
        : JSON.parse(tags)
      : image.tags;
    image.categories = categories
      ? Array.isArray(categories)
        ? categories
        : JSON.parse(categories)
      : image.categories;
    image.image = imageData;
    image.featured = featured !== undefined ? featured : image.featured;
    image.visibility = visibility || image.visibility;

    await image.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: image,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update image",
      error: error.message,
    });
  }
};

// @desc    Delete image (soft delete)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Soft delete
    image.isActive = false;
    await image.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// @desc    Permanently delete image
// @route   DELETE /api/gallery/:id/permanent
// @access  Private/Admin
export const permanentDeleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete image from cloudinary
    if (image.image?.publicId) {
      await deleteFromCloudinary(image.image.publicId);
    }

    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Image permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// @desc    Toggle image featured status
// @route   PATCH /api/gallery/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    image.featured = !image.featured;
    await image.save();

    res.status(200).json({
      success: true,
      message: `Image ${
        image.featured ? "featured" : "unfeatured"
      } successfully`,
      data: image,
    });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update featured status",
      error: error.message,
    });
  }
};

// @desc    Get featured images
// @route   GET /api/gallery/featured
// @access  Public
export const getFeaturedImages = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const images = await Gallery.find({
      featured: true,
      isActive: true,
      visibility: "public",
    })
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching featured images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured images",
      error: error.message,
    });
  }
};

// @desc    Get popular images
// @route   GET /api/gallery/popular
// @access  Public
export const getPopularImages = async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    const images = await Gallery.getPopularImages(
      parseInt(limit),
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching popular images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular images",
      error: error.message,
    });
  }
};

// @desc    Get recent images
// @route   GET /api/gallery/recent
// @access  Public
export const getRecentImages = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const images = await Gallery.getRecentImages(parseInt(limit));

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching recent images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent images",
      error: error.message,
    });
  }
};

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Private/Admin
export const getGalleryStats = async (req, res) => {
  try {
    const stats = await Gallery.getGalleryStats();

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    console.error("Error fetching gallery stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery statistics",
      error: error.message,
    });
  }
};

// @desc    Search images
// @route   GET /api/gallery/search
// @access  Public
export const searchImages = async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const images = await Gallery.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
      isActive: true,
      visibility: "public",
    })
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Gallery.countDocuments({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
      isActive: true,
      visibility: "public",
    });

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search images",
      error: error.message,
    });
  }
};

// @desc    Track image download
// @route   POST /api/gallery/:id/download
// @access  Public
export const trackDownload = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image || !image.isActive) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await image.incrementDownloadCount();

    res.status(200).json({
      success: true,
      message: "Download tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track download",
      error: error.message,
    });
  }
};

// @desc    Bulk delete images
// @route   POST /api/gallery/bulk-delete
// @access  Private/Admin
export const bulkDeleteImages = async (req, res) => {
  try {
    const { imageIds, permanent = false } = req.body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image IDs array is required",
      });
    }

    if (permanent) {
      // Permanent delete
      const images = await Gallery.find({ _id: { $in: imageIds } });

      // Delete from cloudinary
      for (const image of images) {
        if (image.image?.publicId) {
          await deleteFromCloudinary(image.image.publicId);
        }
      }

      await Gallery.deleteMany({ _id: { $in: imageIds } });
    } else {
      // Soft delete
      await Gallery.updateMany(
        { _id: { $in: imageIds } },
        { $set: { isActive: false } }
      );
    }

    res.status(200).json({
      success: true,
      message: `${imageIds.length} images ${
        permanent ? "permanently " : ""
      }deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete images",
      error: error.message,
    });
  }
};

// @desc    Bulk toggle featured status
// @route   POST /api/gallery/bulk-featured
// @access  Private/Admin
export const bulkToggleFeatured = async (req, res) => {
  try {
    const { imageIds, featured } = req.body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image IDs array is required",
      });
    }

    if (featured === undefined) {
      return res.status(400).json({
        success: false,
        message: "Featured status is required",
      });
    }

    await Gallery.updateMany(
      { _id: { $in: imageIds } },
      { $set: { featured } }
    );

    res.status(200).json({
      success: true,
      message: `${imageIds.length} images ${
        featured ? "featured" : "unfeatured"
      } successfully`,
    });
  } catch (error) {
    console.error("Error bulk toggling featured:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update featured status",
      error: error.message,
    });
  }
};
