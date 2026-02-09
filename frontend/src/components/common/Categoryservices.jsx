import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';

const SERVER_URL = 'http://localhost:5000';

const CategoryServices = () => {
  const { categoryName } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('CategoryServices component mounted');
    console.log('Category from URL params:', categoryName);
    fetchCategoryServices();
  }, [categoryName]);

  const fetchCategoryServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching all services...');
      const { data } = await axios.get('/services');
      console.log('Total services received:', data.length);
      console.log('Services:', data);
      
      // Filter services by category (case-insensitive)
      const filteredServices = data.filter(service => {
        if (!service.category || !categoryName) return false;

        return (
          service.category.toLowerCase() === categoryName.toLowerCase()
        );
      });
      
      console.log(`Services matching "${categoryName}":`, filteredServices.length);
      console.log('Filtered services:', filteredServices);
      
      setServices(filteredServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading {categoryName} services...</p>
        </div>
        <style>{loadingStyles}</style>
      </>
    );
  }

  return (
    <>
      <div className="category-services-page">
        <div className="services-container">
          {/* Header with back button */}
          <div className="header-section">
            <Link to="/services" className="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Categories
            </Link>
            <h1 className="page-title">{categoryName} Services</h1>
            <p className="services-count">
              {services.length} {services.length === 1 ? 'service' : 'services'} available
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* No services found */}
          {!loading && !error && services.length === 0 && (
            <div className="no-services">
              <div className="no-services-icon">📦</div>
              <h3>No Services Available</h3>
              <p>There are currently no services in the {categoryName} category.</p>
              <Link to="/services" className="back-link">
                Browse Other Categories
              </Link>
            </div>
          )}

          {/* Services Grid */}
          {services.length > 0 && (
            <div className="services-grid">
              {services.map(service => (
                <div key={service._id} className="service-card">
                  <div className="service-image-container">
                    <img
                      src={service.image ? `${SERVER_URL}${service.image}` : 'https://via.placeholder.com/400x300?text=Service+Image'}
                      alt={service.name}
                      className="service-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Service+Image';
                      }}
                    />
                    <div className="category-badge">{service.category}</div>
                  </div>

                  <div className="service-content">
                    <h2 className="service-name">{service.name}</h2>
                    
                    {service.description && (
                      <p className="service-description">
                        {service.description.length > 120
                          ? `${service.description.substring(0, 120)}...`
                          : service.description}
                      </p>
                    )}

                    {service.location && (
                      <div className="service-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{service.location}</span>
                      </div>
                    )}

                    <div className="service-footer">
                      <div className="price-section">
                        <span className="price-label">Starting from</span>
                        <span className="price">₹{service.price}</span>
                      </div>

                      <Link
                        to={`/user/booking/create/${service._id}`}
                        className="book-button"
                      >
                        Book Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{mainStyles}</style>
    </>
  );
};

const loadingStyles = `
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
    font-family: 'Lato', sans-serif;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #b67a29;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-container p {
    color: #6b7280;
    font-size: 1.1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const mainStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .category-services-page {
    min-height: 100vh;
    background: #faf8f5;
    padding: 2rem;
    font-family: 'Lato', sans-serif;
  }

  .services-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header Section */
  .header-section {
    margin-bottom: 3rem;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #b67a29;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }

  .back-button:hover {
    gap: 0.75rem;
    color: #8f5f1f;
  }

  .page-title {
    font-size: 3rem;
    font-weight: 700;
    color: #2c2c2c;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }

  .services-count {
    color: #6b7280;
    font-size: 1.1rem;
  }

  /* Error Message */
  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    color: #c00;
  }

  /* No Services State */
  .no-services {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .no-services-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .no-services h3 {
    font-size: 1.5rem;
    color: #2c2c2c;
    margin-bottom: 0.5rem;
  }

  .no-services p {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    background: #b67a29;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .back-link:hover {
    background: #8f5f1f;
    transform: translateY(-2px);
  }

  /* Services Grid */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .service-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  /* Service Image */
  .service-image-container {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: linear-gradient(135deg, #e8e8d8 0%, #d0baba 100%);
  }

  .service-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .service-card:hover .service-image {
    transform: scale(1.05);
  }

  .category-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.95);
    color: #2c2c2c;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  /* Service Content */
  .service-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  .service-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2c2c2c;
    line-height: 1.3;
  }

  .service-description {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.6;
    flex: 1;
  }

  .service-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .service-location svg {
    color: #b67a29;
  }

  /* Service Footer */
  .service-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
    margin-top: auto;
  }

  .price-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .price-label {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 500;
  }

  .price {
    font-size: 1.75rem;
    font-weight: 700;
    color: #b67a29;
  }

  .book-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #2c2c2c;
    color: white;
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .book-button:hover {
    background: #1a1a1a;
    transform: translateX(4px);
    gap: 0.75rem;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    .category-services-page {
      padding: 1.5rem 1rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    .service-image-container {
      height: 200px;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 1.75rem;
    }

    .service-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .book-button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default CategoryServices;