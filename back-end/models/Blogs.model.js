import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      maxLength: [50000, "Content cannot exceed 50000 characters"],
    },
    excerpt: {
      type: String,
      maxLength: [500, "Excerpt cannot exceed 500 characters"],
    },

    // Tags and Categories
    tags: [
      {
        type: String,
        trim: true,
        maxLength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    categories: [
      {
        type: String,
        trim: true,
        maxLength: [100, "Category cannot exceed 100 characters"],
      },
    ],

    // Media
    image: {
      url: {
        type: String,
        required: [true, "Blog image is required"],
      },
      publicId: String,
      altText: {
        type: String,
        default: "",
      },
    },

    // Publishing Information
    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "published",
    },
    visibility: {
      type: String,
      enum: ["public", "users_only", "private"],
      default: "public",
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Scheduling
    publishDate: {
      type: Date,
      default: Date.now,
    },
    scheduleDate: {
      type: Date,
      default: null,
    },

    // Author Information
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // SEO Fields
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    metaTitle: {
      type: String,
      maxLength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxLength: [160, "Meta description cannot exceed 160 characters"],
    },
    keywords: [String],

    // Engagement Metrics
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },

    // Reading Time (calculated automatically)
    readingTime: {
      type: Number, // in minutes
      default: 0,
    },

    // Related Content
    relatedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    // Status and Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowSharing: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comments (linked to Comment model if exists)
blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
});

// Virtual for likes (linked to Like model if exists)
blogSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "blog",
});

// Virtual for formatted publish date
blogSchema.virtual("formattedPublishDate").get(function () {
  return this.publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Virtual for formatted reading time
blogSchema.virtual("formattedReadingTime").get(function () {
  if (this.readingTime === 0) return "Less than 1 min read";
  if (this.readingTime === 1) return "1 min read";
  return `${this.readingTime} mins read`;
});

// Virtual for excerpt (if not provided, generate from content)
blogSchema.virtual("generatedExcerpt").get(function () {
  if (this.excerpt) return this.excerpt;

  // Generate excerpt from content (first 150 characters)
  const plainText = this.content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  return plainText.length > 150
    ? plainText.substring(0, 150) + "..."
    : plainText;
});

// Indexes for better query performance
blogSchema.index({ title: "text", content: "text", excerpt: "text" });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ visibility: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ publishDate: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ updatedAt: -1 });
blogSchema.index({ viewCount: -1 });
blogSchema.index({ likeCount: -1 });

// Pre-save middleware to generate slug and update timestamps
blogSchema.pre("save", function (next) {
  // Generate slug from title
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified("content")) {
    const plainText = this.content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const wordCount = plainText.split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Generate meta title if not provided
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title.substring(0, 60);
  }

  // Generate meta description if not provided
  if (!this.metaDescription && this.excerpt) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }

  // Update timestamp
  this.updatedAt = Date.now();

  next();
});

// Method to increment view count
blogSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment like count
blogSchema.methods.incrementLikeCount = function () {
  this.likeCount += 1;
  return this.save();
};

// Method to increment share count
blogSchema.methods.incrementShareCount = function () {
  this.shareCount += 1;
  return this.save();
};

// Method to increment comment count
blogSchema.methods.incrementCommentCount = function () {
  this.commentCount += 1;
  return this.save();
};

// Method to check if blog is published and visible
blogSchema.methods.isVisibleToUser = function (userRole = "guest") {
  if (!this.isActive) return false;

  if (this.visibility === "public") return true;
  if (this.visibility === "users_only" && userRole !== "guest") return true;
  if (this.visibility === "private" && userRole === "admin") return true;

  return false;
};

// Static method to find published blogs
blogSchema.statics.findPublished = function () {
  return this.find({
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  }).sort({ publishDate: -1 });
};

// Static method to find featured blogs
blogSchema.statics.findFeatured = function () {
  return this.find({
    featured: true,
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  }).sort({ publishDate: -1 });
};

// Static method to find blogs by tag
blogSchema.statics.findByTag = function (tag) {
  return this.find({
    tags: { $in: [tag] },
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  }).sort({ publishDate: -1 });
};

// Static method to find blogs by category
blogSchema.statics.findByCategory = function (category) {
  return this.find({
    categories: { $in: [category] },
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  }).sort({ publishDate: -1 });
};

// Static method to find blogs by author
blogSchema.statics.findByAuthor = function (authorId) {
  return this.find({
    author: authorId,
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  }).sort({ publishDate: -1 });
};

// Static method to search blogs
blogSchema.statics.searchBlogs = function (searchTerm, filters = {}) {
  const query = {
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
      { excerpt: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
      { categories: { $in: [new RegExp(searchTerm, "i")] } },
    ],
  };

  // Apply additional filters
  if (filters.category) query.categories = { $in: [filters.category] };
  if (filters.tag) query.tags = { $in: [filters.tag] };
  if (filters.author) query.author = filters.author;
  if (filters.featured !== undefined) query.featured = filters.featured;
  if (filters.dateFrom)
    query.publishDate = { ...query.publishDate, $gte: filters.dateFrom };
  if (filters.dateTo)
    query.publishDate = { ...query.publishDate, $lte: filters.dateTo };

  return this.find(query).sort({ publishDate: -1 });
};

// Static method to get related blogs
blogSchema.statics.getRelatedBlogs = function (blogId, limit = 5) {
  return this.findById(blogId).then((blog) => {
    if (!blog) return [];

    return this.find({
      _id: { $ne: blogId },
      $or: [
        { tags: { $in: blog.tags } },
        { categories: { $in: blog.categories } },
      ],
      status: "published",
      isActive: true,
      publishDate: { $lte: new Date() },
    })
      .sort({ viewCount: -1, publishDate: -1 })
      .limit(limit);
  });
};

// Static method to get blog statistics
blogSchema.statics.getBlogStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalBlogs: { $sum: 1 },
        publishedBlogs: {
          $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
        },
        draftBlogs: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
        },
        featuredBlogs: {
          $sum: { $cond: ["$featured", 1, 0] },
        },
        totalViews: { $sum: "$viewCount" },
        totalLikes: { $sum: "$likeCount" },
        totalShares: { $sum: "$shareCount" },
        totalComments: { $sum: "$commentCount" },
      },
    },
  ]);
};

// Static method to get popular blogs
blogSchema.statics.getPopularBlogs = function (limit = 10, days = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return this.find({
    status: "published",
    isActive: true,
    publishDate: { $gte: dateFrom },
  })
    .sort({ viewCount: -1, likeCount: -1 })
    .limit(limit);
};

// Static method to get recent blogs
blogSchema.statics.getRecentBlogs = function (limit = 10) {
  return this.find({
    status: "published",
    isActive: true,
    publishDate: { $lte: new Date() },
  })
    .sort({ publishDate: -1 })
    .limit(limit);
};

// Static method to get trending blogs (based on recent engagement)
blogSchema.statics.getTrendingBlogs = function (limit = 10, days = 7) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return this.find({
    status: "published",
    isActive: true,
    publishDate: { $gte: dateFrom },
  })
    .sort({
      viewCount: -1,
      likeCount: -1,
      shareCount: -1,
      publishDate: -1,
    })
    .limit(limit);
};

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
