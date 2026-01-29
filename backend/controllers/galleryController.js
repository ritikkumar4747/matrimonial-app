import GalleryPost from "../models/GalleryPost.js";

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const post = await GalleryPost.create({
      user: req.user._id,
      photo: `/uploads/${req.file.filename}`,
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
