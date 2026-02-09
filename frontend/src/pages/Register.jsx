import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: location.pathname === '/worker/register' ? 'worker' : 'user',
    address: '',
    location: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  useEffect(() => {
    if (location.pathname === '/worker/register') {
      setFormData(prev => ({ ...prev, role: 'worker' }));
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userData = { ...formData };
      
      // Convert skills to array if worker
      if (formData.role === 'worker' && formData.skills) {
        userData.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      
      await register(userData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          <div className="register-card">
            <h2 className="register-title">Register</h2>
            
            {/* Role Selection Buttons */}
            <div className="role-selection">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`role-btn ${formData.role === 'user' ? 'active' : ''}`}
              >
                Register as User
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'worker' })}
                className={`role-btn ${formData.role === 'worker' ? 'active' : ''}`}
              >
                Register as Worker
              </button>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="1234567890"
                  required
                />
              </div>

              {formData.role === 'user' && (
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              )}

              {formData.role === 'worker' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Plumbing, Electrical, Carpentry"
                      className="form-input"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="divider-section">
              <div className="divider-line"></div>
              <span className="divider-text">Or continue with</span>
              <div className="divider-line"></div>
            </div>

            <button
              onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
              className="google-btn"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lato:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          background: #f9f4ee;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          font-family: 'Lato', sans-serif;
        }

        .register-container {
          width: 100%;
          max-width: 600px;
        }

        .register-card {
          background: white;
          border: 2px solid #e8dcc8;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          padding: 3rem 2.5rem;
        }

        .register-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #3d3d3d;
          text-align: center;
          margin-bottom: 2rem;
        }

        .role-selection {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .role-btn {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e8dcc8;
          border-radius: 8px;
          background: white;
          color: #6b6b6b;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }

        .role-btn:hover {
          border-color: #ebe6e0;
          color: #3d3d3d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(196, 151, 93, 0.15);
        }

        .role-btn.active {
          background: #3d3d3d;
          color: white;
          border-color: #3d3d3d;
          box-shadow: 0 4px 12px rgba(61, 61, 61, 0.2);
        }

        .role-btn.active:hover {
          background: #2a2a2a;
          border-color: #2a2a2a;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          border-left: 4px solid #dc2626;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #3d3d3d;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #e8dcc8;
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          color: #3d3d3d;
          transition: all 0.3s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #c4975d;
          background: white;
          box-shadow: 0 0 0 3px rgba(196, 151, 93, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .submit-btn {
          width: 100%;
          background: #3d3d3d;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2a2a2a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(61, 61, 61, 0.3);
        }

        .submit-btn:disabled {
          background: #b0b0b0;
          cursor: not-allowed;
        }

        .divider-section {
          display: flex;
          align-items: center;
          margin: 2rem 0 1.5rem;
          gap: 1rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e8dcc8;
        }

        .divider-text {
          font-size: 0.9rem;
          color: #6b6b6b;
          white-space: nowrap;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border: 1px solid #e8dcc8;
          border-radius: 8px;
          background: white;
          color: #3d3d3d;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }

        .google-btn:hover {
          background: #faf8f5;
          border-color: #c4975d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .google-icon {
          width: 20px;
          height: 20px;
        }

        .login-link {
          text-align: center;
          margin-top: 2rem;
          color: #6b6b6b;
          font-size: 0.95rem;
        }

        .login-link a {
          color: #c4975d;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .login-link a:hover {
          color: #b08549;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .register-page {
            padding: 2rem 1rem;
          }

          .register-card {
            padding: 2rem 1.5rem;
          }

          .register-title {
            font-size: 2rem;
          }

          .role-selection {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Register;