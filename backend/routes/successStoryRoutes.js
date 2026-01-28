import express from "express";
import SuccessStory from "../models/SuccessStory.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get featured success stories
router.get("/featured", async (req, res) => {
  try {
    const stories = await SuccessStory.find({
      approved: true,
      featured: true,
    })
      .populate("user1Id", "name photos age city")
      .populate("user2Id", "name photos age city")
      .sort("-createdAt")
      .limit(10);

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all approved stories (paginated)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const stories = await SuccessStory.find({
      approved: true,
    })
      .populate("user1Id", "name photos age city")
      .populate("user2Id", "name photos age city")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await SuccessStory.countDocuments({ approved: true });

    res.json({
      stories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStories: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get story by ID
router.get("/:storyId", async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.storyId)
      .populate("user1Id", "name photos age city")
      .populate("user2Id", "name photos age city");

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new success story
router.post("/", protect, async (req, res) => {
  try {
    const { user2Id, title, story, howTheyMet, matchDate, status } = req.body;
    const user1Id = req.user._id;

    // Validate
    if (!user2Id || !title || !story) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get user details
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "User not found" });
    }

    const successStory = new SuccessStory({
      user1Id,
      user2Id,
      title,
      story,
      howTheyMet,
      matchDate,
      status,
      couple: {
        name1: user1.name,
        name2: user2.name,
        photo1: user1.photos?.[0],
        photo2: user2.photos?.[0],
      },
    });

    await successStory.save();

    res.json({
      message: "Success story submitted (pending approval)",
      story: successStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like story
router.post("/:storyId/like", protect, async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.storyId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json({
      message: "Story liked",
      likes: story.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's stories
router.get("/user/:userId", async (req, res) => {
  try {
    const stories = await SuccessStory.find({
      $or: [
        { user1Id: req.params.userId },
        { user2Id: req.params.userId },
      ],
    })
      .populate("user1Id", "name photos")
      .populate("user2Id", "name photos");

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
