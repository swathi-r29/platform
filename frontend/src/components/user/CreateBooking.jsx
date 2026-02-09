import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const CreateBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    workerId: '',
    scheduledDate: '',
    scheduledTime: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(`/services/${serviceId}`);
      setService(data);
      if (data.workers.length > 0) {
        setFormData(prev => ({ ...prev, workerId: data.workers[0]._id }));
      }
    } catch (error) {
      setError('Failed to load service');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/bookings', {
        serviceId,
        ...formData
      });
      navigate('/user/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Service</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <div className="space-y-2">
            <p className="text-gray-700"><span className="font-semibold">Category:</span> {service.category}</p>
            <p className="text-gray-700"><span className="font-semibold">Duration:</span> {service.duration} hours</p>
            <p className="text-gray-700"><span className="font-semibold">Location:</span> {service.location}</p>
            <p className="text-2xl font-bold text-blue-600 mt-4">₹{service.price}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Worker</label>
              <select
                name="workerId"
                value={formData.workerId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {service.workers.map(worker => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} - {worker.location} ({worker.rating?.toFixed(1)} ⭐)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <select
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Time</option>
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your complete address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Any special instructions or requirements"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;