import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import BookingCard from './BookingCard';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/user/bookings');
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`/bookings/${id}/cancel`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredBookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={handleCancel}
            onRefresh={fetchBookings}
          />
        ))}

        {filteredBookings.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No bookings found</p>
            <Link
              to="/user/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;