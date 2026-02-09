import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data } = await axios.get('/admin/workers');
      setWorkers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(`/admin/users/${id}`);
        fetchWorkers();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete worker');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Worker Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Skills</th>
              <th className="px-6 py-3 text-left">Rating</th>
              <th className="px-6 py-3 text-left">Earnings</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(worker => (
              <tr key={worker._id} className="border-t">
                <td className="px-6 py-4">{worker.name}</td>
                <td className="px-6 py-4">{worker.email}</td>
                <td className="px-6 py-4">{worker.phone}</td>
                <td className="px-6 py-4">{worker.location}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">{worker.rating?.toFixed(1)} ⭐</td>
                <td className="px-6 py-4">₹{worker.earnings}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    worker.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(worker._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No workers found</div>
        )}
      </div>
    </div>
  );
};

export default WorkerManagement;