import express from 'express';
import { getChatbotResponse, getInitialGreeting } from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * Get chatbot response based on user message
 * POST /api/chatbot/message
 * Body: { message: string }
 */
router.post('/message', getChatbotResponse);

/**
 * Get initial greeting when chatbot opens
 * GET /api/chatbot/greeting
 */
router.get('/greeting', getInitialGreeting);

export default router;
