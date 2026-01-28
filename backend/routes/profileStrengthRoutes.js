import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import { calculateProfileStrength, getProfileStrengthSuggestions } from "../utils/profileStrength.js";

const router = express.Router();

// Get profile strength for a user
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate score
    const score = calculateProfileStrength(user);
    
    // Get improvement suggestions
    const suggestions = getProfileStrengthSuggestions(user);

    // Category breakdown
    const breakdown = {
      photos: {
        score: 0,
        max: 15,
        status: "incomplete"
      },
      basicInfo: {
        score: 0,
        max: 35,
        status: "incomplete"
      },
      detailedInfo: {
        score: 0,
        max: 30,
        status: "incomplete"
      },
      verification: {
        score: 0,
        max: 20,
        status: "incomplete"
      }
    };

    // Photos (15 points)
    if (user.photos && user.photos.length >= 3) {
      breakdown.photos.score = 15;
      breakdown.photos.status = "complete";
    } else if (user.photos && user.photos.length >= 1) {
      breakdown.photos.score = 7;
      breakdown.photos.status = "partial";
    }

    // Basic Info (35 points)
    let basicScore = 0;
    if (user.name && user.name.length > 3) basicScore += 5;
    if (user.age && user.age >= 18) basicScore += 5;
    if (user.gender) basicScore += 5;
    if (user.location && user.location.city) basicScore += 5;
    if (user.religion) basicScore += 5;
    if (user.bio && user.bio.length > 20) basicScore += 10;
    breakdown.basicInfo.score = basicScore;
    breakdown.basicInfo.status = basicScore >= 30 ? "complete" : basicScore >= 15 ? "partial" : "incomplete";

    // Detailed Info (30 points)
    let detailedScore = 0;
    if (user.profession) detailedScore += 10;
    if (user.education) detailedScore += 5;
    if (user.height) detailedScore += 5;
    if (user.interests && user.interests.length > 0) detailedScore += 5;
    if (user.hobbies && user.hobbies.length > 0) detailedScore += 5;
    breakdown.detailedInfo.score = detailedScore;
    breakdown.detailedInfo.status = detailedScore >= 25 ? "complete" : detailedScore >= 10 ? "partial" : "incomplete";

    // Verification (20 points)
    let verificationScore = 0;
    if (user.verified) verificationScore += 20;
    breakdown.verification.score = verificationScore;
    breakdown.verification.status = verificationScore >= 15 ? "complete" : verificationScore >= 5 ? "partial" : "incomplete";

    res.json({
      userId: user._id,
      score,
      maxScore: 100,
      percentage: Math.round((score / 100) * 100),
      level: score >= 80 ? "excellent" : score >= 60 ? "good" : score >= 40 ? "fair" : "poor",
      breakdown,
      suggestions,
      completedFields: Object.keys(user).filter(key => user[key] && user[key] !== "").length,
      totalFields: Object.keys(user).length
    });
  } catch (error) {
    console.error("Profile strength error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
