import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendInterest,
  getReceived,
  getSent,
  updateStatus,
  getInterestStatus
} from "../controllers/interestcontroller.js";
import { getMutualMatches } from "../controllers/interestcontroller.js";




const router = express.Router();

router.post("/send", protect, sendInterest);
router.get("/mutual", protect, getMutualMatches);
router.get("/received", protect, getReceived);
router.get("/sent", protect, getSent);
router.put("/:id", protect, updateStatus);
router.get("/status/:userId", protect, getInterestStatus);

export default router;
