import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema(
  {
    viewer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    viewed: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    viewedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate entries and optimize queries
profileViewSchema.index({ viewer: 1, viewed: 1 });
profileViewSchema.index({ viewed: 1, viewedAt: -1 });

export default mongoose.model("ProfileView", profileViewSchema);
