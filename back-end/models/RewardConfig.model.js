import mongoose from "mongoose";

const rewardConfigSchema = new mongoose.Schema({
  pointsPerDollar: {
    type: Number,
    default: 10,
    min: 0,
  },
  signupBonus: {
    type: Number,
    default: 100,
    min: 0,
  },
  referralBonus: {
    user: {
      type: Number,
      default: 250,
      min: 0,
    },
    referrer: {
      type: Number,
      default: 500,
      min: 0,
    },
  },
  reviewBonus: {
    type: Number,
    default: 50,
    min: 0,
  },
  tierRequirements: {
    silver: {
      type: Number,
      default: 500,
      min: 0,
    },
    gold: {
      type: Number,
      default: 1500,
      min: 0,
    },
    platinum: {
      type: Number,
      default: 3000,
      min: 0,
    },
  },
  tierBenefits: {
    silver: {
      discount: {
        type: Number,
        default: 5,
        min: 0,
        max: 100,
      },
      priority: {
        type: Boolean,
        default: false,
      },
    },
    gold: {
      discount: {
        type: Number,
        default: 10,
        min: 0,
        max: 100,
      },
      priority: {
        type: Boolean,
        default: true,
      },
      earlyAccess: {
        type: Boolean,
        default: true,
      },
    },
    platinum: {
      discount: {
        type: Number,
        default: 15,
        min: 0,
        max: 100,
      },
      priority: {
        type: Boolean,
        default: true,
      },
      earlyAccess: {
        type: Boolean,
        default: true,
      },
      dedicatedSupport: {
        type: Boolean,
        default: true,
      },
    },
  },
  redemptionOptions: [
    {
      points: {
        type: Number,
        required: true,
        min: 0,
      },
      reward: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
        min: 0,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const RewardConfig = mongoose.model("RewardConfig", rewardConfigSchema);

export default RewardConfig;
