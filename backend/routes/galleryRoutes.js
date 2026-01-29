import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryUpload.js";
import { 
  uploadPhoto, 
  getMyGallery, 
  getUserGallery, 
  deletePhoto,
  getMatchedGalleryFeed 
} from "../controllers/galleryController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("photo"), uploadPhoto);
router.get("/my", protect, getMyGallery);
router.get("/feed", protect, getMatchedGalleryFeed);
router.get("/:userId", protect, getUserGallery);
router.delete("/:postId", protect, deletePhoto);

export default router;
