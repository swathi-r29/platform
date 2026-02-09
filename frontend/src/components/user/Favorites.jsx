import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const SERVER_URL = 'http://localhost:5000';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('/favorites');
      setFavorites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (serviceId) => {
    try {
      await axios.delete(`/favorites/${serviceId}`);
      fetchFavorites();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove favorite');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Favorite Services</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No favorite services yet</p>
          <Link
            to="/user/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {favorites.map(favorite => (
            <div key={favorite._id} className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {favorite.service?.image && (
                <img src={`${SERVER_URL}${favorite.service.image}`} alt={favorite.service.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{favorite.service?.name}</h3>
                    <p className="text-gray-600 mb-2">{favorite.service?.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Category: {favorite.service?.category}</p>
                    <p className="text-sm text-gray-500 mb-4">Location: {favorite.service?.location}</p>
                    <p className="text-2xl font-bold text-blue-600">₹{favorite.service?.price}</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.service._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove from favorites"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <Link
                  to={`/user/booking/create/${favorite.service._id}`}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
