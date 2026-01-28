import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  updateProfile,
  getMyProfile,
  getAllProfiles,
  getUserProfile,
  getProfileViewers,
  searchUsers,
  getRecommendedMatches,
  getProfileStats,
  uploadPhoto
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.get("/all", protect, getAllProfiles);
router.get("/search", protect, searchUsers);
router.get("/recommended", protect, getRecommendedMatches);
router.get("/viewers", protect, getProfileViewers);
router.get("/stats", protect, getProfileStats);
router.get("/:userId", protect, getUserProfile);
router.post(
  "/photo",
  protect,
  upload.single("photo"),
  uploadPhoto
);


export default router;
