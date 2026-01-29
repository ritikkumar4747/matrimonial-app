import GalleryPost from "../models/GalleryPost.js";
import Interest from "../models/Interest.js";

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const post = await GalleryPost.create({
      user: req.user._id,
      photo: req.file.path, // Cloudinary URL
      caption: req.body.caption || ""
    });

    const populated = await post.populate("user", "name photo");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyGallery = async (req, res) => {
  try {
    const posts = await GalleryPost.find({ user: req.user._id })
      .populate("user", "name photo")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserGallery = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if viewing own gallery
    if (userId === req.user._id.toString()) {
      const posts = await GalleryPost.find({ user: userId })
        .populate("user", "name photo")
        .sort({ createdAt: -1 });
      return res.json(posts);
    }

    // Check if users are mutually matched
    const mutualMatch = await Interest.findOne({
      $or: [
        { from: req.user._id, to: userId, status: "accepted" },
        { from: userId, to: req.user._id, status: "accepted" }
      ]
    });

    // Also check reverse direction for mutual acceptance
    const reverseMatch = await Interest.findOne({
      $or: [
        { from: userId, to: req.user._id, status: "accepted" },
        { from: req.user._id, to: userId, status: "accepted" }
      ]
    });

    if (!mutualMatch || !reverseMatch) {
      return res.status(403).json({ 
        message: "You can only view gallery of mutually matched users" 
      });
    }

    const posts = await GalleryPost.find({ user: userId })
      .populate("user", "name photo")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await GalleryPost.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await GalleryPost.findByIdAndDelete(postId);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get gallery feed from all mutually matched users
export const getMatchedGalleryFeed = async (req, res) => {
  try {
    // Get all mutual matches
    const sentInterests = await Interest.find({
      from: req.user._id,
      status: "accepted"
    }).select("to");

    const receivedInterests = await Interest.find({
      to: req.user._id,
      status: "accepted"
    }).select("from");

    // Find mutual matches (both accepted each other)
    const mutualUserIds = [];
    for (const sent of sentInterests) {
      const isMutual = receivedInterests.some(
        (received) => received.from.toString() === sent.to.toString()
      );
      if (isMutual) {
        mutualUserIds.push(sent.to);
      }
    }

    // Get posts from mutual matches + own posts
    const posts = await GalleryPost.find({
      user: { $in: [...mutualUserIds, req.user._id] }
    })
      .populate("user", "name photo")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
