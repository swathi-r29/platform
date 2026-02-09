import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const SERVER_URL = 'http://localhost:5000';

const ServiceCard = ({ service, favorites = [] }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const favorite = favorites.find(
      fav => fav.service?._id === service._id
    );
    setIsFavorite(!!favorite);
  }, [favorites, service._id]);

  const handleAddToFavorites = async () => {
    try {
      await axios.put(`/favorites/${service._id}/favorite`);
      setIsFavorite(prev => !prev);
      alert(isFavorite ? 'Removed from favorites!' : 'Added to favorites!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const imageUrl =
    service.image && !imgError
      ? `${SERVER_URL}${service.image}`
      : '/placeholder-service.png';

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src={imageUrl}
        alt={service.name}
        onError={() => setImgError(true)}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{service.name}</h3>

        <p className="text-gray-600 mb-2 line-clamp-2">
          {service.description}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Category: {service.category}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Location: {service.location}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ₹{service.price}
          </span>

          <button
            onClick={handleAddToFavorites}
            className={`p-2 rounded-full transition ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className="w-6 h-6"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <Link
          to={`/user/booking/create/${service._id}`}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
