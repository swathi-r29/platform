const express = require('express');
const {
  getWorkerProfile,
  updateWorkerProfile,
  getWorkerBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getWorkerEarnings
} = require('../controllers/workerController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const router = express.Router();

router.use(protect);
router.use(checkRole('worker'));

router.get('/profile', getWorkerProfile);
router.put('/profile', upload.single('profileImage'), updateWorkerProfile);
router.get('/bookings', getWorkerBookings);
router.put('/bookings/:id/accept', acceptBooking);
router.put('/bookings/:id/reject', rejectBooking);
router.put('/bookings/:id/complete', completeBooking);
router.get('/earnings', getWorkerEarnings);

module.exports = router;