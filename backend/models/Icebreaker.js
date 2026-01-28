import mongoose from "mongoose";

const IcebreakerSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["hobby", "travel", "food", "lifestyle", "career", "music", "sport", "custom"],
      required: true,
    },
    trigger: String, // e.g., "love_hiking" from user profile
    message: {
      type: String,
      required: true,
    },
    followUp: String, // Optional follow-up message
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    uses: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Icebreaker", IcebreakerSchema);
