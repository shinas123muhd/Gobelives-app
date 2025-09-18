// server/models/Review.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property", // References the Property model
    required: true,
  },
  // Useful for sorting and management
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // If you want to allow users to edit reviews, track this
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can only leave one review per property
reviewSchema.index({ author: 1, property: 1 }, { unique: true });

// Optional: A pre-save hook to update the `updatedAt` field
reviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
