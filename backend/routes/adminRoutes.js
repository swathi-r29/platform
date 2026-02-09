const express = require('express');
const {
  getAllUsers,
  getAllWorkers,
  getAllBookings,
  getAnalytics,
  getRecentBookings,
  updateUser,
  sendMessageToUser,
  deleteUser,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const { getChartData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { ensureSingleAdmin, preventAdminModification } = require('../middleware/adminCheck');
const User = require('../models/User');
const router = express.Router();

// Apply middleware in order
router.use(protect);

// Public route to get admin info for chat functionality
router.get('/info', async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ _id: adminUser._id, name: adminUser.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use(checkRole('admin'));
router.use(ensureSingleAdmin);

// Define routes
router.get('/', (req, res) => {
  res.json(req.user);
});
router.get('/users', getAllUsers);
router.get('/workers', getAllWorkers);
router.get('/bookings', getAllBookings);
router.get('/analytics', getAnalytics);
router.get('/analytics/charts', getChartData);
router.get('/recent-bookings', getRecentBookings);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/users/:id', updateUser);
router.post('/users/:id/message', sendMessageToUser);
router.delete('/users/:id', preventAdminModification, deleteUser);

module.exports = router;