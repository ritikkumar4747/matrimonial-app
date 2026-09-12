import express from "express";
import Story from "../models/Story.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

/**
 * @route   GET /api/stories
 * @desc    Fetch active ephemeral stories (created within last 24h)
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "name photo city profession")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/stories
 * @desc    Upload an ephemeral 24-hour story
 * @access  Private
 */
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    const mediaUrl = req.file?.path || req.body.mediaUrl;
    if (!mediaUrl) {
      return res.status(400).json({ message: "Media is required for stories" });
    }

    const story = await Story.create({
      user: req.user._id,
      mediaUrl,
      mediaType: req.body.mediaType || "image",
      caption: req.body.caption || "",
    });

    const populated = await Story.findById(story._id).populate(
      "user",
      "name photo city profession"
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/stories/:id/view
 * @desc    Mark story as viewed by current user
 * @access  Private
 */
router.post("/:id/view", protect, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { viewers: req.user._id } },
      { new: true }
    );
    if (!story) return res.status(404).json({ message: "Story not found or expired" });
    res.json({ message: "Story viewed", views: story.viewers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
