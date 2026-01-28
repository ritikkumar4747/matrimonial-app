import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId", protect, getMessages);
router.post("/send", protect, sendMessage);

export default router;
