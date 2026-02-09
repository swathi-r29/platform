import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-container">
      <nav>
        <button className="menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Left side - Text content */}
        <div className="hero-text">
          <h1 className="hero-title">
            Book Trusted Services<br />
            At Your Doorstep<br />
            Anytime, Anywhere
          </h1>
          <p className="hero-description">
            From home repairs to personal care, find verified professionals 
            for all your needs. Quality service delivery with transparent 
            pricing and real-time tracking. Your satisfaction, our priority.
          </p>
          <div className="cta-buttons">
  <Link to="/services" className="cta-button primary">
    Browse Services
  </Link>

  <Link to="/register" className="cta-button secondary">
    Become a Provider
  </Link>
</div>

          
          <div className="social-links">
            <span className="follow-text">Follow Us</span>
            <a href="#twitter" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right side - Image section */}
        <div className="hero-image-section">
          <div className="blob-container">
            <div className="image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop" 
                alt="Professional service worker providing quality service"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="blob blob-left"></div>
      <div className="blob blob-right"></div>
      <div className="blob blob-bottom"></div>

      {/* Share button */}
      <button className="share-btn" aria-label="Share">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .hero-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8e8d8 0%, #d0baba 50%, 	#ddc8bd 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Lato', sans-serif;
        }

        /* Hero Content */
        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 150px auto 0;
        }

        .hero-text {
          flex: 1;
          max-width: 600px;
          animation: fadeInUp 1s ease-out;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          color: #2c2c2c;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .hero-description {
          color: #5a5a5a;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 500px;
          font-weight: 300;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        .cta-button {
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 400;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button.primary {
          background:#b67a29 ;
          color: white;
          box-shadow: 0 4px 15px rgba(95, 94, 93, 0.3);
        }

        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(48, 48, 46, 0.4);
          background: #e68d1a;
        }

        .cta-button.secondary {
          background: transparent;
          color:white ;
          border: 2px solid black;  ;
          background: black;
          box-shadow: 0 4px 15px rgba(44, 44, 44, 0.1);
        }

        .cta-button.secondary:hover {
          transform: translateY(-2px);
          background: #2c2c2c;
          color: white;
          box-shadow: 0 6px 20px rgba(44, 44, 44, 0.2);
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 3rem;
          animation: fadeInUp 1s ease-out 0.8s both;
        }

        .follow-text {
          color: #2c2c2c;
          font-size: 1rem;
          font-weight: 400;
        }

        .social-links a {
          color: #2c2c2c;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-links a:hover {
          color: #f89d28;
          transform: translateY(-2px);
        }

        /* Hero Image Section */
        .hero-image-section {
          
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          animation: fadeIn 1.2s ease-out 0.4s both;
        }

        .blob-container {
          position: relative;
          width: 500px;
          height: 500px;
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          overflow: hidden;
          animation: morphBlob 8s ease-in-out infinite;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* Decorative Blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          background: rgba(248, 157, 40, 0.15);
          z-index: 1;
        }

        .blob-left {
          width: 350px;
          height: 350px;
          top: -100px;
          left: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .blob-right {
          width: 400px;
          height: 400px;
          top: 50%;
          right: -150px;
          background:rgba(196, 155, 112, 0.2);
          animation: float 7s ease-in-out infinite reverse;
        }

        .blob-bottom {
          width: 300px;
          height: 300px;
          bottom: -100px;
          left: 30%;
          background: rgba(196, 161, 112, 0.3);
          animation: float 8s ease-in-out infinite;
        }

        /* Share Button */
        .share-btn {
          position: fixed;
          bottom: 3rem;
          right: 3rem;
          width: 56px;
          height: 56px;
          background: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
          z-index: 10;
          color: #2c2c2c;
        }

        .share-btn:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
          background: #f89d28;
          color: white;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes morphBlob {
          0%, 100% {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          25% {
            border-radius: 60% 40% 50% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 50% 60% 30% 70% / 50% 60% 40% 60%;
          }
          75% {
            border-radius: 70% 30% 60% 40% / 40% 70% 50% 60%;
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            padding: 2rem 2rem;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .blob-container {
            width: 400px;
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            padding: 1rem 1.5rem;
          }

          .hero-text {
            margin-bottom: 3rem;
          }

          .hero-title {
            font-size: 2.2rem;
          }

          .blob-container {
            width: 350px;
            height: 350px;
          }

          .social-links {
            justify-content: center;
          }

          .cta-buttons {
            justify-content: center;
          }

          .blob-left,
          .blob-right,
          .blob-bottom {
            opacity: 0.5;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-description {
            font-size: 0.95rem;
          }

          .blob-container {
            width: 300px;
            height: 300px;
          }

          .cta-button {
            padding: 0.9rem 2rem;
            font-size: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .cta-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;