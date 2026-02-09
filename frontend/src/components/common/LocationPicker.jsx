import { useState, useEffect } from 'react';

const LocationPicker = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setAddress(data.display_name);
            onLocationSelect({
              latitude,
              longitude,
              address: data.display_name
            });
          } catch (error) {
            console.error('Error getting address:', error);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const searchLocation = async (searchText) => {
    if (!searchText) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const location = data[0];
        const coords = {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon)
        };
        setCoordinates(coords);
        setAddress(location.display_name);
        onLocationSelect({
          ...coords,
          address: location.display_name
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation(address)}
            placeholder="Enter location or use current location"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? '...' : '📍'}
          </button>
          <button
            type="button"
            onClick={() => searchLocation(address)}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300"
          >
            Search
          </button>
        </div>
      </div>

      {coordinates && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Coordinates:</strong> {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </p>
          <div className="mt-2 h-64 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.longitude-0.01},${coordinates.latitude-0.01},${coordinates.longitude+0.01},${coordinates.latitude+0.01}&layer=mapnik&marker=${coordinates.latitude},${coordinates.longitude}`}
              style={{ border: 0 }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;