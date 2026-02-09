import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const AddService = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Plumbing',
    price: '',
    duration: '',
    location: '',
    workers: []
  });
  const [image, setImage] = useState(null);
  const [allWorkers, setAllWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data } = await axios.get('/admin/workers');
      setAllWorkers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkerToggle = (workerId) => {
    setFormData(prev => ({
      ...prev,
      workers: prev.workers.includes(workerId)
        ? prev.workers.filter(id => id !== workerId)
        : [...prev.workers, workerId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('duration', formData.duration);
      data.append('location', formData.location);
      formData.workers.forEach(workerId => data.append('workers', workerId));
      if (image) data.append('image', image);

      // FIXED: Changed from 'api/services' to '/services'
      // The baseURL already includes '/api', so we just need '/services'
      await axios.post('/services', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/admin/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Service</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Painting">Painting</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign Workers</label>
          <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
            {allWorkers.map(worker => (
              <div key={worker._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.workers.includes(worker._id)}
                  onChange={() => handleWorkerToggle(worker._id)}
                  className="mr-3 h-4 w-4"
                />
                <span>{worker.name} - {worker.location} ({worker.skills.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Adding...' : 'Add Service'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;