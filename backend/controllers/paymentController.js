// Commented out Razorpay payment implementation as per user request
/*
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId,
        userId: req.user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const booking = await Booking.findById(bookingId);
      booking.paymentStatus = 'paid';
      booking.paymentMethod = 'online';
      booking.paymentDetails = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      };
      await booking.save();

      res.json({ message: 'Payment verified successfully', booking });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

// Placeholder functions to prevent import errors
const createPaymentOrder = async (req, res) => {
  res.status(501).json({ message: 'Payment functionality is currently disabled' });
};

const verifyPayment = async (req, res) => {
  res.status(501).json({ message: 'Payment functionality is currently disabled' });
};

module.exports = { createPaymentOrder, verifyPayment };
