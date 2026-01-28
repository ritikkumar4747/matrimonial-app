import express from "express";
import DailySwipe from "../models/DailySwipe.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import { calculateMatchScore } from "../utils/matchscore.js";

const router = express.Router();

// Get daily match for user
router.get("/daily-match/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if already swiped today
    const existingSwipe = await DailySwipe.findOne({
      userId,
      date: new Date(today),
    });

    if (existingSwipe) {
      return res.json({
        message: "Already swiped today",
        swipedToday: true,
      });
    }

    // Find user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find compatible matches (excluding already swiped users)
    const swipedUsers = await DailySwipe.find({ userId }).distinct(
      "matchedUserId"
    );
    const blockedUsers = currentUser.blockedUsers || [];

    const potentialMatches = await User.find({
      _id: {
        $ne: userId,
        $nin: [...swipedUsers, ...blockedUsers],
      },
      gender: currentUser.preferredGender || {
        $ne: currentUser.gender,
      },
    })
      .limit(10)
      .lean();

    if (potentialMatches.length === 0) {
      return res.status(404).json({
        message: "No matches available today",
        match: null,
      });
    }

    // Calculate match score for each and pick best one
    const matchesWithScores = potentialMatches.map((match) => ({
      ...match,
      matchScore: calculateMatchScore(currentUser, match),
    }));

    const bestMatch = matchesWithScores.reduce((prev, current) =>
      prev.matchScore > current.matchScore ? prev : current
    );

    res.json({
      match: {
        _id: bestMatch._id,
        name: bestMatch.name,
        age: bestMatch.age,
        photos: bestMatch.photos,
        bio: bestMatch.bio,
        location: bestMatch.location,
        profession: bestMatch.profession,
        religion: bestMatch.religion,
        matchScore: Math.round(bestMatch.matchScore),
      },
      swipedToday: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record a swipe
router.post("/daily-match/:userId/swipe", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { matchedUserId, action } = req.body;

    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Create swipe record
    const swipe = new DailySwipe({
      userId,
      matchedUserId,
      action,
      date: new Date().setHours(0, 0, 0, 0),
    });

    await swipe.save();

    // If like, create interest
    if (action === "like") {
      const Interest = require("../models/Interest.js").default;
      await Interest.findOneAndUpdate(
        { from: userId, to: matchedUserId },
        {
          from: userId,
          to: matchedUserId,
          status: "interested",
          source: "daily_match",
        },
        { upsert: true }
      );
    }

    res.json({
      message: `Successfully ${action}d this match`,
      swipe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get daily match stats
router.get("/daily-match/:userId/stats", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const stats = await DailySwipe.aggregate([
      {
        $match: {
          userId: new (require("mongoose").Types.ObjectId)(userId),
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalSwipes = await DailySwipe.countDocuments({
      userId,
      date: { $gte: thirtyDaysAgo },
    });

    res.json({
      totalSwipes,
      likes: stats.find((s) => s._id === "like")?.count || 0,
      passes: stats.find((s) => s._id === "pass")?.count || 0,
      daysActive: await DailySwipe.find({ userId, date: { $gte: thirtyDaysAgo } })
        .distinct("date")
        .countDocuments(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
