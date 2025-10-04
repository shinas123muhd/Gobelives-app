import Blog from "../models/Blogs.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Get all blogs with filters
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const {
      search,
      status,
      visibility,
      featured,
      tag,
      category,
      author,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Visibility filter
    if (visibility) {
      query.visibility = visibility;
    }

    // Featured filter
    if (featured !== undefined) {
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

    // Author filter
    if (author) {
      query.author = author;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Active blogs only (soft delete)
    query.isActive = true;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Execute query
    const blogs = await Blog.find(query)
      .populate("author", "firstName lastName email")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "firstName lastName email"
    );

    if (!blog || !blog.isActive) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    await blog.incrementViewCount();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// @desc    Get blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("author", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    await blog.incrementViewCount();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      categories,
      visibility,
      status,
      scheduleDate,
      metaTitle,
      metaDescription,
      keywords,
      featured,
    } = req.body;

    // Handle image upload
    let imageData = {};
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file, "blogs");
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        altText: title || "Blog image",
      };
    } else if (req.body.image) {
      // If image is provided as base64 or URL
      imageData = {
        url: req.body.image,
        publicId: "",
        altText: title || "Blog image",
      };
    }

    // Create blog
    const blog = await Blog.create({
      title,
      content,
      excerpt,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags || "[]"),
      categories: Array.isArray(categories)
        ? categories
        : JSON.parse(categories || "[]"),
      image: imageData,
      visibility: visibility || "public",
      status: status || "published",
      scheduleDate: scheduleDate || null,
      metaTitle,
      metaDescription,
      keywords: Array.isArray(keywords)
        ? keywords
        : JSON.parse(keywords || "[]"),
      featured: featured || false,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      content,
      excerpt,
      tags,
      categories,
      visibility,
      status,
      scheduleDate,
      metaTitle,
      metaDescription,
      keywords,
      featured,
    } = req.body;

    // Handle image upload if new image is provided
    let imageData = blog.image;
    if (req.file) {
      // Delete old image from cloudinary if exists
      if (blog.image?.publicId) {
        await deleteFromCloudinary(blog.image.publicId);
      }

      const uploadResult = await uploadOnCloudinary(req.file, "blogs");
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        altText: title || blog.title,
      };
    }

    // Update blog fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.excerpt = excerpt !== undefined ? excerpt : blog.excerpt;
    blog.tags = tags
      ? Array.isArray(tags)
        ? tags
        : JSON.parse(tags)
      : blog.tags;
    blog.categories = categories
      ? Array.isArray(categories)
        ? categories
        : JSON.parse(categories)
      : blog.categories;
    blog.image = imageData;
    blog.visibility = visibility || blog.visibility;
    blog.status = status || blog.status;
    blog.scheduleDate =
      scheduleDate !== undefined ? scheduleDate : blog.scheduleDate;
    blog.metaTitle = metaTitle !== undefined ? metaTitle : blog.metaTitle;
    blog.metaDescription =
      metaDescription !== undefined ? metaDescription : blog.metaDescription;
    blog.keywords = keywords
      ? Array.isArray(keywords)
        ? keywords
        : JSON.parse(keywords)
      : blog.keywords;
    blog.featured = featured !== undefined ? featured : blog.featured;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// @desc    Delete blog (soft delete)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Soft delete
    blog.isActive = false;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// @desc    Permanently delete blog
// @route   DELETE /api/blogs/:id/permanent
// @access  Private/Admin
export const permanentDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete image from cloudinary if exists
    if (blog.image?.publicId) {
      await deleteFromCloudinary(blog.image.publicId);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// @desc    Toggle blog featured status
// @route   PATCH /api/blogs/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.featured = !blog.featured;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog ${blog.featured ? "featured" : "unfeatured"} successfully`,
      data: blog,
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

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({
      featured: true,
      status: "published",
      isActive: true,
      publishDate: { $lte: new Date() },
    })
      .populate("author", "firstName lastName")
      .sort({ publishDate: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured blogs",
      error: error.message,
    });
  }
};

// @desc    Get popular blogs
// @route   GET /api/blogs/popular
// @access  Public
export const getPopularBlogs = async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    const blogs = await Blog.getPopularBlogs(parseInt(limit), parseInt(days));

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular blogs",
      error: error.message,
    });
  }
};

// @desc    Get recent blogs
// @route   GET /api/blogs/recent
// @access  Public
export const getRecentBlogs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const blogs = await Blog.getRecentBlogs(parseInt(limit));

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent blogs",
      error: error.message,
    });
  }
};

// @desc    Get related blogs
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const relatedBlogs = await Blog.getRelatedBlogs(
      req.params.id,
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: relatedBlogs,
    });
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related blogs",
      error: error.message,
    });
  }
};

// @desc    Get blog statistics
// @route   GET /api/blogs/stats
// @access  Private/Admin
export const getBlogStats = async (req, res) => {
  try {
    const stats = await Blog.getBlogStats();

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog statistics",
      error: error.message,
    });
  }
};

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
export const searchBlogs = async (req, res) => {
  try {
    const { q, limit = 10, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
      status: "published",
      isActive: true,
    })
      .populate("author", "firstName lastName")
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Blog.countDocuments({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
      status: "published",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search blogs",
      error: error.message,
    });
  }
};
