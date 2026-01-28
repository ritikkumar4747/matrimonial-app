import mongoose from "mongoose";

const SuccessStorySchema = new mongoose.Schema(
  {
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    story: {
      type: String,
      required: true,
      minlength: 20,
    },
    howTheyMet: {
      type: String,
      enum: ["daily_match", "search", "interest", "recommendation"],
    },
    matchDate: Date,
    couple: {
      name1: String,
      name2: String,
      photo1: String,
      photo2: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["engaged", "married", "dating"],
      default: "dating",
    },
  },
  { timestamps: true }
);

SuccessStorySchema.index({ approved: 1, featured: -1, createdAt: -1 });

export default mongoose.model("SuccessStory", SuccessStorySchema);
