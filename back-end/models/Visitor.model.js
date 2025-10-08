import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
    browser: {
      type: String,
      default: null,
    },
    os: {
      type: String,
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
    },
    isUnique: {
      type: Boolean,
      default: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
visitorSchema.index({ visitDate: 1 });
visitorSchema.index({ page: 1, visitDate: 1 });
visitorSchema.index({ sessionId: 1 });

// Static method to get visitor statistics
visitorSchema.statics.getVisitorStats = async function (startDate, endDate) {
  const pipeline = [
    {
      $match: {
        visitDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$visitDate" },
          month: { $month: "$visitDate" },
          day: { $dayOfMonth: "$visitDate" },
          hour: { $hour: "$visitDate" },
        },
        totalVisits: { $sum: 1 },
        uniqueVisits: { $sum: { $cond: ["$isUnique", 1, 0] } },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 },
    },
  ];

  return await this.aggregate(pipeline);
};

// Static method to get daily visitor counts
visitorSchema.statics.getDailyVisitors = async function (days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const pipeline = [
    {
      $match: {
        visitDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$visitDate" },
          month: { $month: "$visitDate" },
          day: { $dayOfMonth: "$visitDate" },
        },
        visits: { $sum: 1 },
        uniqueVisits: { $sum: { $cond: ["$isUnique", 1, 0] } },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ];

  return await this.aggregate(pipeline);
};

// Static method to get hourly visitor counts for today
visitorSchema.statics.getHourlyVisitors = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pipeline = [
    {
      $match: {
        visitDate: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: { $hour: "$visitDate" },
        visits: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  return await this.aggregate(pipeline);
};

export default mongoose.model("Visitor", visitorSchema);
