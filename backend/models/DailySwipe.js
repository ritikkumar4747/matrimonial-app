import mongoose from "mongoose";

const DailySwipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "pass"],
      required: true,
    },
    date: {
      type: Date,
      default: () => new Date().setHours(0, 0, 0, 0),
      index: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Compound index for daily swipes
DailySwipeSchema.index({ userId: 1, date: -1 });
DailySwipeSchema.index({ userId: 1, matchedUserId: 1, date: -1 });

export default mongoose.model("DailySwipe", DailySwipeSchema);
