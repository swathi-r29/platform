const express = require('express');
const {
  createBooking,
  getBookingById,
  updateBookingPayment,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);
router.use(checkRole('user'));

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id/payment', updateBookingPayment);
router.put('/:id/cancel', cancelBooking);

module.exports = router;