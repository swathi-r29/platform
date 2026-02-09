import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Payment from './Payment';
import ReviewForm from './ReviewForm';

const BookingCard = ({ booking, onCancel, onRefresh }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  const toggleFavorite = async () => {
    try {
      await axios.put(`/favorites/${booking._id}/favorite`);
      onRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update favorite');
    }
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg transition min-h-[300px]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{booking.service?.name}</h3>
              {booking.status === 'completed' && (
                <button
                  onClick={toggleFavorite}
                  className={`${booking.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                  title={booking.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-1">Worker: {booking.worker?.name}</p>
            <p className="text-sm text-gray-500">Phone: {booking.worker?.phone}</p>
            <p className="text-sm text-gray-500">Email: {booking.worker?.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
            </p>
            <p className="text-sm text-gray-500">Address: {booking.address}</p>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
            <p className="text-2xl font-bold mt-2">₹{booking.totalAmount}</p>
            <p className="text-sm text-gray-500">
              Payment: <span className={booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                {booking.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {booking.status === 'accepted' && booking.paymentStatus === 'pending' && (
            <button
              onClick={() => setShowPayment(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Make Payment
            </button>
          )}

          {booking.status === 'accepted' && (
            <Link
              to={`/chat/${booking._id}`}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Chat
            </Link>
          )}

          {booking.status === 'completed' && (
            <button
              onClick={() => setShowReview(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Write Review
            </button>
          )}

          {(booking.status === 'pending' || booking.status === 'accepted') && (
            <button
              onClick={() => onCancel(booking._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {showPayment && (
        <Payment
          booking={booking}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            onRefresh();
          }}
        />
      )}

      {showReview && (
        <ReviewForm
          booking={booking}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default BookingCard;