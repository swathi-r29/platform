import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import SearchFilter from '../common/SearchFilter';
import ServiceCard from '../common/ServiceCard';

const UserDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Carpentry',
    'Painting',
    'AC Repair',
    'Other',
  ];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();

      const [servicesRes, bookingsRes, favoritesRes] = await Promise.all([
        axios.get(`/services${queryParams ? `?${queryParams}` : ''}`),
        axios.get('/user/bookings'),
        axios.get('/favorites'),
      ]);

      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
      setFavorites(favoritesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((service) => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-layout">
        {/* LEFT SIDEBAR - FULL HEIGHT */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>Categories</h3>
          </div>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN CONTENT - RIGHT SIDE */}
        <main className="dashboard-main">
          {/* PAGE TITLE */}
          <div className="page-header">
            <h1>User Dashboard</h1>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <h3>Total Bookings</h3>
              <p className="stat-number">{bookings.length}</p>
            </div>

            <div className="stat-card stat-green">
              <h3>Completed</h3>
              <p className="stat-number stat-green-text">
                {bookings.filter((b) => b.status === 'completed').length}
              </p>
            </div>

            <div className="stat-card stat-yellow">
              <h3>Pending</h3>
              <p className="stat-number stat-yellow-text">
                {bookings.filter((b) => b.status === 'pending').length}
              </p>
            </div>
          </div>

          {/* AVAILABLE SERVICES */}
          <div className="services-section">
            <h2>Available Services</h2>
            <SearchFilter onFilterChange={handleFilterChange} />
          </div>

          {/* SERVICES GRID */}
          <section className="services-grid-section">
            <div className="services-grid">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  favorites={favorites}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="no-services">
                <p>No services found</p>
              </div>
            )}
          </section>

          {/* RECENT BOOKINGS */}
          <div className="bookings-section">
            <div className="bookings-header">
              <h2>My Recent Bookings</h2>
              <Link to="/user/bookings" className="view-all-link">
                View All Bookings →
              </Link>
            </div>

            <div className="bookings-list">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-content">
                    <div className="booking-info">
                      <h3>{booking.service?.name}</h3>
                      <p className="booking-worker">
                        Worker: {booking.worker?.name}
                      </p>
                      <p className="booking-detail">
                        Date:{' '}
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="booking-detail">
                        Time: {booking.scheduledTime}
                      </p>
                    </div>

                    <div className="booking-status-section">
                      <span
                        className={`status-badge ${
                          booking.status === 'completed'
                            ? 'status-completed'
                            : booking.status === 'accepted'
                            ? 'status-accepted'
                            : booking.status === 'pending'
                            ? 'status-pending'
                            : 'status-cancelled'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <p className="booking-amount">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Lato', sans-serif;
          color: #3d3d3d;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e8dcc8;
          border-top: 4px solid #3d3d3d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dashboard Layout */
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          font-family: 'Lato', sans-serif;
          background: #faf8f5;
        }

        /* Left Sidebar */
        .dashboard-sidebar {
          width: 350px;
          margin-top: 20px;
          background: white;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
          position: fixed;
          left: 0;
          top: 65px; /* Adjust based on navbar height */
          bottom: 0;
          overflow-y: auto;
          z-index: 100;
        }

        .sidebar-header {
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid #e8dcc8;
        }

        .sidebar-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #3d3d3d;
        }

        .category-list {
          list-style: none;
          padding: 1rem;
        }

        .category-list li {
          margin-bottom: 0.5rem;
        }

        .category-btn {
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          background: #f5f5f5;
          color: #3d3d3d;
          font-size: 0.95rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Lato', sans-serif;
        }

        .category-btn:hover {
          background: #e8dcc8;
          color: #3d3d3d;
        }

        .category-btn.active {
          background: #3d3d3d;
          color: white;
          font-weight: 500;
        }

        /* Main Content */
        .dashboard-main {
          flex: 1;
          margin-left: 350px; /* Match sidebar width */
          padding: 2rem 3rem;
        }

        /* Page Header */
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #3d3d3d;
          font-family: 'Playfair Display', serif;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .stat-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #3d3d3d;
          margin-bottom: 0.75rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
        }

        .stat-blue {
          background: #d6e9f8;
        }

        .stat-blue .stat-number {
          color: #2563eb;
        }

        .stat-green {
          background: #d1f4e0;
        }

        .stat-green-text {
          color: #059669;
        }

        .stat-yellow {
          background: #fef3c7;
        }

        .stat-yellow-text {
          color: #d97706;
        }

        /* Services Section */
        .services-section {
          margin-bottom: 2rem;
        }

        .services-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3d3d3d;
          margin-bottom: 1.5rem;
        }

        .services-grid-section {
          margin-bottom: 4rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .no-services {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b6b6b;
        }

        .no-services p {
          font-size: 1.1rem;
        }

        /* Bookings Section */
        .bookings-section {
          margin-top: 3rem;
        }

        .bookings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .bookings-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3d3d3d;
        }

        .view-all-link {
          color: #3d3d3d;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .view-all-link:hover {
          color: #c4975d;
          text-decoration: underline;
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-card {
          background: white;
          border: 1px solid #e8dcc8;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.3s;
        }

        .booking-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .booking-content {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .booking-info h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #3d3d3d;
          margin-bottom: 0.5rem;
        }

        .booking-worker {
          color: #6b6b6b;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .booking-detail {
          color: #6b6b6b;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .booking-status-section {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .status-completed {
          background: #d1f4e0;
          color: #059669;
        }

        .status-accepted {
          background: #d6e9f8;
          color: #2563eb;
        }

        .status-pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .booking-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3d3d3d;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .dashboard-main {
            padding: 1.5rem 2rem;
          }

          .services-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 200px;
          }

          .dashboard-main {
            margin-left: 200px;
            padding: 1.5rem;
          }

          .page-header h1 {
            font-size: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .booking-content {
            flex-direction: column;
            gap: 1rem;
          }

          .booking-status-section {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .dashboard-sidebar {
            position: fixed;
            left: -250px;
            transition: left 0.3s;
            width: 250px;
          }

          .dashboard-sidebar.mobile-open {
            left: 0;
          }

          .dashboard-main {
            margin-left: 0;
            padding: 1rem;
          }

          .bookings-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        /* Scrollbar Styling */
        .dashboard-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .dashboard-sidebar::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        .dashboard-sidebar::-webkit-scrollbar-thumb {
          background: #c4975d;
          border-radius: 3px;
        }

        .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
          background: #b08549;
        }
      `}</style>
    </>
  );
};

export default UserDashboard;