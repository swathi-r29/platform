// backend/routes/chatbotRoutes.js

const express = require('express');
const {
  getChatResponse,
  getServiceSuggestions,
  saveChatHistory
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can chat
router.post('/chat', getChatResponse);

// Get service suggestions
router.get('/suggestions', getServiceSuggestions);

// Protected route - save chat history for logged-in users
router.post('/history', protect, saveChatHistory);

module.exports = router;