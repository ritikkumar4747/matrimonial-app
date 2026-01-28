import express from "express";
import Icebreaker from "../models/Icebreaker.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get icebreakers for a user's interests
router.get("/suggestions/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { matchedUserId } = req.query;

    if (!matchedUserId) {
      return res.status(400).json({ message: "matchedUserId required" });
    }

    const User = require("../models/User.js").default;
    const matchedUser = await User.findById(matchedUserId).lean();

    if (!matchedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract interests/hobbies from user profile
    const triggers = [
      matchedUser.interests || [],
      matchedUser.hobbies || [],
      matchedUser.profession || "",
      matchedUser.favoriteFood || "",
    ]
      .flat()
      .filter(Boolean);

    // Find icebreakers that match
    const suggestions = await Icebreaker.find({
      $or: triggers.map((trigger) => ({
        trigger: new RegExp(trigger, "i"),
      })),
    }).limit(5);

    // If not enough matches, get random top-rated ones
    if (suggestions.length < 5) {
      const additional = await Icebreaker.find({
        _id: { $nin: suggestions.map((s) => s._id) },
      })
        .sort("-successRate -uses")
        .limit(5 - suggestions.length);

      suggestions.push(...additional);
    }

    res.json({
      suggestions: suggestions.map((s) => ({
        _id: s._id,
        message: s.message,
        followUp: s.followUp,
        category: s.category,
        successRate: s.successRate,
      })),
      matchName: matchedUser.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record icebreaker usage
router.post("/track/:icebreakerId", protect, async (req, res) => {
  try {
    const { icebreakerId } = req.params;
    const { converted } = req.body;

    const icebreaker = await Icebreaker.findByIdAndUpdate(
      icebreakerId,
      {
        $inc: {
          uses: 1,
          conversions: converted ? 1 : 0,
        },
      },
      { new: true }
    );

    // Update success rate
    if (icebreaker) {
      icebreaker.successRate = Math.round(
        (icebreaker.conversions / icebreaker.uses) * 100
      );
      await icebreaker.save();
    }

    res.json({
      message: "Usage tracked",
      icebreaker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top icebreakers
router.get("/top", async (req, res) => {
  try {
    const topIcebreakers = await Icebreaker.find()
      .sort("-successRate -uses")
      .limit(20);

    res.json(topIcebreakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create icebreaker
router.post("/", protect, async (req, res) => {
  try {
    const { category, trigger, message, followUp } = req.body;

    // Validate admin (in production, check user role)
    const icebreaker = new Icebreaker({
      category,
      trigger,
      message,
      followUp,
    });

    await icebreaker.save();

    res.json({
      message: "Icebreaker created",
      icebreaker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
