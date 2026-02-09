import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const WorkerProfile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    skills: '',
    isAvailable: true,
    password: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/worker/profile');
      const data = response.data;
      
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        location: data.location || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        password: ''
      });
      
      // Fix image preview URL
      if (data.profileImage) {
        // If profileImage already has http, use it as is; otherwise prepend base URL
        const imageUrl = data.profileImage.startsWith('http') 
          ? data.profileImage 
          : `http://localhost:5000${data.profileImage}`;
        setImagePreview(imageUrl);
        console.log('Profile image URL:', imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Failed to load profile');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to load profile');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        setError('Phone is required');
        setLoading(false);
        return;
      }

      if (!formData.location.trim()) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('location', formData.location.trim());
      
      // Convert skills string to array
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');
      
      // Send as JSON string
      submitData.append('skills', JSON.stringify(skillsArray));
      
      submitData.append('isAvailable', formData.isAvailable.toString());
      
      // Only append password if it's provided
      if (formData.password && formData.password.trim() !== '') {
        submitData.append('password', formData.password);
      }
      
      // Only append profile image if a new one is selected
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      console.log('Submitting form data...');

      const response = await axios.put('/worker/profile', submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });

      console.log('Profile updated successfully:', response.data);
      setSuccess('Profile updated successfully!');
      setFormData({ ...formData, password: '' });
      setProfileImage(null);
      
      // Refresh profile data to show updated image
      await fetchProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err.response);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something else happened
        setError('Failed to update profile. Please try again.');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchProfile();
    setProfileImage(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow">
        {/* Profile Image Preview */}
        <div className="mb-6 flex flex-col items-center">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Profile Preview" 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              onError={(e) => {
                console.error('Image failed to load:', imagePreview);
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23999"%3E?%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">Profile Picture</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (comma separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Plumbing, Electrical, Carpentry"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="mr-2 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Available for bookings
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Turn this off if you're not currently accepting new bookings
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a new profile image (JPG, PNG, GIF - Max 5MB)
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only fill this if you want to change your password
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update Profile'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default WorkerProfile;