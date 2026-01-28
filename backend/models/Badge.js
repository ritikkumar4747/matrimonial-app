import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badgeType: {
      type: String,
      enum: [
        "first_match",
        "profile_complete",
        "5_likes",
        "10_likes",
        "great_talker",
        "popular",
        "on_fire",
        "verified_user",
        "success_story",
      ],
      required: true,
    },
    title: String,
    description: String,
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic"],
      default: "common",
    },
    awardedAt: {
      type: Date,
      default: Date.now,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate badges
BadgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true });

export default mongoose.model("Badge", BadgeSchema);
