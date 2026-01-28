import express from "express";
import Badge from "../models/Badge.js";
import User from "../models/User.js";
import DailySwipe from "../models/DailySwipe.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Badge definitions
const BADGES = {
  first_match: {
    title: "First Match 💕",
    description: "Received your first match",
    rarity: "common",
  },
  profile_complete: {
    title: "Complete Profile 🎯",
    description: "Filled out all profile fields",
    rarity: "common",
  },
  five_likes: {
    title: "Popular 👍",
    description: "Received 5 likes",
    rarity: "uncommon",
  },
  ten_likes: {
    title: "Very Popular 👑",
    description: "Received 10 likes",
    rarity: "uncommon",
  },
  great_talker: {
    title: "Great Talker 💬",
    description: "Exchanged 50 messages",
    rarity: "uncommon",
  },
  on_fire: {
    title: "On Fire 🔥",
    description: "Got 5 likes in one week",
    rarity: "rare",
  },
  verified_user: {
    title: "Verified ✓",
    description: "Completed verification",
    rarity: "uncommon",
  },
  success_story: {
    title: "Success Story 💍",
    description: "Your success story was featured",
    rarity: "epic",
  },
};

// Get user badges
router.get("/:userId", protect, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.params.userId, visible: true }).sort("-awardedAt");
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get badge progress (for unlocking next badges)
router.get("/:userId/progress", protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count various metrics
    const receivedLikes = await User.countDocuments({
      "sentInterests.to": userId,
      "sentInterests.status": "interested",
    });

    const messageCount = await User.findById(userId).select("conversations");

    const swipedThisWeek = await DailySwipe.countDocuments({
      userId,
      action: "like",
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    const progress = {
      profileCompletion: calculateProfileCompletion(user),
      likesReceived: receivedLikes,
      messagesExchanged: messageCount ? Object.keys(messageCount.conversations || {}).length : 0,
      swipedThisWeek,
      dailyStreak: calculateDailyStreak(userId),
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Award badge to user
router.post("/:userId/award", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeType } = req.body;

    if (!BADGES[badgeType]) {
      return res.status(400).json({ message: "Invalid badge type" });
    }

    // Check if already has badge
    const existingBadge = await Badge.findOne({ userId, badgeType });
    if (existingBadge) {
      return res.json({ message: "User already has this badge", badge: existingBadge });
    }

    const badge = new Badge({
      userId,
      badgeType,
      ...BADGES[badgeType],
    });

    await badge.save();

    // Update user profile
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { badges: badge._id } },
      { new: true }
    );

    res.json({
      message: "Badge awarded successfully",
      badge,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check and auto-award badges
router.post("/:userId/check-achievements", protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const awardedBadges = [];

    // Check profile completion
    if (calculateProfileCompletion(user) >= 90) {
      const existing = await Badge.findOne({ userId, badgeType: "profile_complete" });
      if (!existing) {
        const badge = await Badge.create({
          userId,
          badgeType: "profile_complete",
          ...BADGES.profile_complete,
        });
        awardedBadges.push(badge);
      }
    }

    // Check if verified
    if (user.verified) {
      const existing = await Badge.findOne({ userId, badgeType: "verified_user" });
      if (!existing) {
        const badge = await Badge.create({
          userId,
          badgeType: "verified_user",
          ...BADGES.verified_user,
        });
        awardedBadges.push(badge);
      }
    }

    res.json({
      message: "Achievement check complete",
      newBadges: awardedBadges,
      totalBadges: await Badge.countDocuments({ userId, visible: true }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
function calculateProfileCompletion(user) {
  const requiredFields = [
    "name",
    "age",
    "gender",
    "photos",
    "bio",
    "location",
    "religion",
    "profession",
  ];
  const filledFields = requiredFields.filter((field) => {
    const value = user[field];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });
  return Math.round((filledFields.length / requiredFields.length) * 100);
}

async function calculateDailyStreak(userId) {
  const swipes = await DailySwipe.find({ userId }).sort("-date").limit(30);
  let streak = 0;

  if (swipes.length === 0) return 0;

  const today = new Date().setHours(0, 0, 0, 0);
  let currentDate = today;

  for (const swipe of swipes) {
    const swipeDate = new Date(swipe.date).setHours(0, 0, 0, 0);
    if (swipeDate === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000;
    } else {
      break;
    }
  }

  return streak;
}

export default router;
