import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingActions from './BookingActions';

const WorkerBookingCard = ({ booking, onRefresh }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg transition min-h-[300px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{booking.service?.name}</h3>
          <p className="text-gray-600 mb-1">Customer: {booking.user?.name}</p>
          <p className="text-sm text-gray-500">Phone: {booking.user?.phone}</p>
          <p className="text-sm text-gray-500">Email: {booking.user?.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
          </p>
          <p className="text-sm text-gray-500">Address: {booking.address}</p>
          {booking.notes && <p className="text-sm text-gray-500 mt-2">Notes: {booking.notes}</p>}
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

      {booking.status === 'accepted' && (
        <div className="mb-4">
          <Link
            to={`/chat/${booking._id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
          >
            Chat with Customer
          </Link>
        </div>
      )}

      <BookingActions booking={booking} onRefresh={onRefresh} />
    </div>
  );
};

export default WorkerBookingCard;
