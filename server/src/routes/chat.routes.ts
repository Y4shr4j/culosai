import express from 'express';
import { protect } from '../middleware/auth';
import {
  sendMessage,
  getConversationHistory,
  getSuggestions,
  getRecentConversations,
  startConversation
} from '../controllers/chat.controller';

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Start a new conversation with a character
router.post('/start', startConversation);

// Send a message and get AI response
router.post('/send', sendMessage);

// Get conversation history
router.get('/history/:characterId/:conversationId', getConversationHistory);

// Get conversation suggestions for a character
router.get('/suggestions/:characterId', getSuggestions);

// Get user's recent conversations
router.get('/recent', getRecentConversations);

export default router; 