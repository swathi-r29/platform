const express = require('express');
const passport = require('../config/passport');
const { register, login, adminLogin, googleAuthCallback, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Check if Google OAuth is available
router.get('/google/status', (req, res) => {
  const available = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret';
  res.json({ available });
});

// Google OAuth routes - only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret') {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);
}

module.exports = router;