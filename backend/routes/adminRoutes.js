const express = require('express');
const {
  getAllUsers,
  getAllWorkers,
  getAllBookings,
  getAnalytics,
  getRecentBookings,
  deleteUser,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const { getChartData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { ensureSingleAdmin, preventAdminModification } = require('../middleware/adminCheck');
const router = express.Router();

// Apply middleware in order
router.use(protect);
router.use(checkRole('admin'));
router.use(ensureSingleAdmin);

// Define routes
router.get('/users', getAllUsers);
router.get('/workers', getAllWorkers);
router.get('/bookings', getAllBookings);
router.get('/analytics', getAnalytics);
router.get('/analytics/charts', getChartData);
router.get('/recent-bookings', getRecentBookings);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.delete('/users/:id', preventAdminModification, deleteUser);

module.exports = router;