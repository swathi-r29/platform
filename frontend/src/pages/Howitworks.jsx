import { useState, useEffect, useRef } from 'react';

const HowItWorksPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const userSteps = [
    {
      icon: '🌐',
      title: 'Visit ServiceHub',
      description: 'Open your browser and visit servicehub.com - no app downloads required!',
      color: 'from-blue-500 to-blue-600',
      illustration: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="20" y="40" width="160" height="120" rx="8" fill="#3B82F6" opacity="0.2" />
          <rect x="25" y="45" width="150" height="110" rx="6" fill="#ffffff" />
          <rect x="25" y="45" width="150" height="25" fill="#3B82F6" />
          <circle cx="35" cy="57" r="4" fill="#EF4444" />
          <circle cx="47" cy="57" r="4" fill="#F59E0B" />
          <circle cx="59" cy="57" r="4" fill="#10B981" />
          <text x="100" y="100" textAnchor="middle" fill="#3B82F6" fontSize="36" fontWeight="bold">🌐</text>
          <text x="100" y="135" textAnchor="middle" fill="#6B7280" fontSize="12">servicehub.com</text>
        </svg>
      ),
    },
    {
      icon: '🔍',
      title: 'Choose Service',
      description: 'Browse through our wide range of home services and select what you need',
      color: 'from-purple-500 to-purple-600',
      illustration: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="30" y="40" width="50" height="50" rx="8" fill="#8B5CF6" opacity="0.8" />
          <rect x="90" y="40" width="50" height="50" rx="8" fill="#8B5CF6" />
          <rect x="150" y="40" width="50" height="50" rx="8" fill="#8B5CF6" opacity="0.8" />
          <rect x="30" y="100" width="50" height="50" rx="8" fill="#8B5CF6" opacity="0.8" />
          <rect x="90" y="100" width="50" height="50" rx="8" fill="#8B5CF6" opacity="0.8" />
          <rect x="150" y="100" width="50" height="50" rx="8" fill="#8B5CF6" opacity="0.8" />
          <circle cx="115" cy="65" r="25" fill="#10B981" opacity="0.9" />
          <text x="115" y="75" textAnchor="middle" fill="white" fontSize="20">✓</text>
        </svg>
      ),
    },
    {
      icon: '📅',
      title: 'Book Appointment',
      description: 'Select your preferred date, time slot, and provide service details online',
      color: 'from-blue-500 to-cyan-600',
      illustration: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="40" y="40" width="120" height="120" rx="10" fill="#0891B2" />
          <rect x="40" y="40" width="120" height="30" rx="10" fill="#0E7490" />
          <circle cx="70" cy="30" r="5" fill="#1F2937" />
          <circle cx="130" cy="30" r="5" fill="#1F2937" />
          <rect x="50" y="80" width="25" height="20" fill="white" opacity="0.7" />
          <rect x="87.5" y="80" width="25" height="20" fill="white" opacity="0.7" />
          <rect x="125" y="80" width="25" height="20" fill="white" opacity="0.7" />
          <rect x="50" y="110" width="25" height="20" fill="white" />
          <rect x="87.5" y="110" width="25" height="20" fill="white" opacity="0.7" />
          <rect x="125" y="110" width="25" height="20" fill="white" opacity="0.7" />
          <text x="62.5" y="125" textAnchor="middle" fill="#0891B2" fontSize="12" fontWeight="bold">15</text>
        </svg>
      ),
    },
    {
      icon: '👷',
      title: 'Professional Arrives',
      description: 'Our verified professional arrives at your doorstep at the scheduled time',
      color: 'from-green-500 to-green-600',
      illustration: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="140" rx="40" ry="10" fill="#D1D5DB" opacity="0.5" />
          <circle cx="100" cy="60" r="20" fill="#F59E0B" />
          <rect x="80" y="80" width="40" height="50" rx="20" fill="#10B981" />
          <text x="100" y="108" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ServiceHub</text>
          <rect x="90" y="130" width="8" height="35" fill="#047857" />
          <rect x="102" y="130" width="8" height="35" fill="#047857" />
          <circle cx="94" cy="168" r="5" fill="#065F46" />
          <circle cx="106" cy="168" r="5" fill="#065F46" />
          <rect x="120" y="90" width="25" height="30" fill="#F59E0B" />
        </svg>
      ),
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description: 'Service completed! Rate your experience and help us serve you better',
      color: 'from-yellow-500 to-yellow-600',
      illustration: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="60" fill="#FCD34D" opacity="0.2" />
          <path d="M100 40 L110 70 L142 75 L121 95 L126 127 L100 112 L74 127 L79 95 L58 75 L90 70 Z" fill="#F59E0B" />
          <path d="M145 50 L150 60 L162 62 L153 70 L155 82 L145 77 L135 82 L137 70 L128 62 L140 60 Z" fill="#FBBF24" opacity="0.7" />
          <path d="M55 120 L60 130 L72 132 L63 140 L65 152 L55 147 L45 152 L47 140 L38 132 L50 130 Z" fill="#FBBF24" opacity="0.7" />
        </svg>
      ),
    },
  ];

  const workerSteps = [
    {
      icon: '📝',
      title: 'Register Online',
      description: 'Sign up on our platform with your skills, experience, and certifications',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '✅',
      title: 'Get Verified',
      description: 'Complete background check and skill verification process',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🔔',
      title: 'Receive Bookings',
      description: 'Get notified of service requests in your area through our platform',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '💼',
      title: 'Complete Jobs',
      description: 'Deliver quality service and build your reputation online',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '💰',
      title: 'Earn & Grow',
      description: 'Get paid instantly and grow your business with ServiceHub',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Safe & Secure',
      description: 'All professionals are background verified and trained. Your safety is our priority.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book services in under 60 seconds directly from your browser - no app needed.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💳',
      title: 'Flexible Payment',
      description: 'Multiple payment options including cash, card, UPI, and digital wallets.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: '⏰',
      title: 'On-Time Service',
      description: 'Professionals arrive on time or we compensate you with credits.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '🎯',
      title: 'Quality Guaranteed',
      description: '100% satisfaction guarantee or we redo the service for free.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Round-the-clock customer support available via chat, email, and phone.',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="hero-container">
      {/* Hero Section - Removed wavy line, increased size */}
      <section className="relative text-black py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8e8d8 0%, #d0baba 50%, #ddc8bd 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black mb-8 animate-fade-in-up">
              How ServiceHub Works
            </h1>
            <p className="text-2xl md:text-3xl text-black/90 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Getting professional home services has never been easier. 
              Book instantly from your browser - no app downloads needed!
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-auto">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* For Users Section */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        id="users-section"
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold mb-4">
              For Customers
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Book Services in 5 Easy Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From booking to completion, everything happens right in your browser
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {userSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 mb-16 transform transition-all duration-1000 ${
                  isVisible['users-section'] ? 'translate-x-0 opacity-100' : index % 2 === 0 ? '-translate-x-20 opacity-0' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                {index % 2 === 0 ? (
                  <>
                    {/* Illustration */}
                    <div className="w-full md:w-1/2">
                      <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                        <div className="w-full h-64">
                          {step.illustration}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-blue-600 font-bold text-lg">Step {index + 1}</span>
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content */}
                    <div className="w-full md:w-1/2 order-2 md:order-1">
                      <div className="flex items-start gap-4 md:justify-end">
                        <div className="md:text-right">
                          <div className="flex items-center gap-3 mb-2 md:justify-end">
                            <span className="text-blue-600 font-bold text-lg">Step {index + 1}</span>
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Illustration */}
                    <div className="w-full md:w-1/2 order-1 md:order-2">
                      <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                        <div className="w-full h-64">
                          {step.illustration}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Workers Section */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)}
        id="workers-section"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-semibold mb-4">
              For Professionals
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Join Our Professional Network
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Grow your business and earn more by partnering with ServiceHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {workerSteps.map((step, index) => (
              <div
                key={index}
                className={`relative transform transition-all duration-1000 ${
                  isVisible['workers-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all hover:scale-105 h-full border border-white/20">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="text-blue-400 font-bold text-sm mb-2">Step {index + 1}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
                
                {index < workerSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className="text-blue-500 text-2xl">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={(el) => (sectionRefs.current[2] = el)}
        id="features-section"
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-semibold mb-4">
              Why Choose ServiceHub
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Built for Your Convenience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've thought of everything to make your experience seamless and delightful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-1000 ${
                  isVisible['features-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full border-2 border-transparent hover:border-blue-200">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-black" style={{ background: 'linear-gradient(135deg, #e8e8d8 0%, #d0baba 50%, #ddc8bd 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-black max-w-2xl mx-auto">
            Join thousands of satisfied customers and professionals on India's most trusted service platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/services" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:text-black transition-all transform hover:scale-105 shadow-xl">
              Browse Services Now
            </a>
            <a href="/worker/register" className="bg-transparent border-2 border-black text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-black hover:text-white transition-all transform hover:scale-105">
              Become a Partner
            </a>
          </div>
        </div>
      </section>

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HowItWorksPage;