const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type, relatedId = null, relatedModel = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId,
      relatedModel
    });
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};

const notifyBookingCreated = async (workerId, bookingId, userName, serviceName) => {
  await createNotification(
    workerId,
    'New Booking Received!',
    `${userName} has booked ${serviceName}. Please review and accept.`,
    'booking',
    bookingId,
    'Booking'
  );
};

const notifyBookingAccepted = async (userId, bookingId, workerName, serviceName) => {
  await createNotification(
    userId,
    'Booking Accepted!',
    `${workerName} has accepted your booking for ${serviceName}. Please make payment.`,
    'booking',
    bookingId,
    'Booking'
  );
};

const notifyBookingRejected = async (userId, bookingId, workerName, serviceName) => {
  await createNotification(
    userId,
    'Booking Rejected',
    `${workerName} has rejected your booking for ${serviceName}.`,
    'booking',
    bookingId,
    'Booking'
  );
};

const notifyPaymentReceived = async (workerId, bookingId, userName, amount) => {
  await createNotification(
    workerId,
    'Payment Received!',
    `${userName} has completed payment of ₹${amount}. You can now start the service.`,
    'payment',
    bookingId,
    'Booking'
  );
};

const notifyServiceCompleted = async (userId, bookingId, serviceName) => {
  await createNotification(
    userId,
    'Service Completed!',
    `Your ${serviceName} has been completed. Please submit a review.`,
    'booking',
    bookingId,
    'Booking'
  );
};

const notifyReviewReceived = async (workerId, reviewId, userName, rating) => {
  await createNotification(
    workerId,
    'New Review!',
    `${userName} has rated you ${rating} stars. Check your reviews.`,
    'review',
    reviewId,
    'Review'
  );
};

module.exports = {
  createNotification,
  notifyBookingCreated,
  notifyBookingAccepted,
  notifyBookingRejected,
  notifyPaymentReceived,
  notifyServiceCompleted,
  notifyReviewReceived
};