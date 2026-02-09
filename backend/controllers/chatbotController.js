// backend/controllers/chatbotController.js

const Service = require('../models/Service');

// Get chatbot response
exports.getChatResponse = async (req, res) => {
  try {
    const { message, context } = req.body;

    console.log('Chatbot request:', { message, context });

    // Convert message to lowercase for easier matching
    const msg = message.toLowerCase();

    // Service-specific responses
    if (msg.includes('plumb') || msg.includes('leak') || msg.includes('pipe')) {
      const plumbingServices = await Service.find({ category: 'Plumbing' }).limit(3);
      return res.json({
        success: true,
        response: {
          text: "I can help you with plumbing services! 🚰 We offer:\n\n• Pipe repairs & installations\n• Leak fixing\n• Drain cleaning\n• Bathroom fittings\n\nPrices start from ₹299. Would you like to book a plumber?",
          services: plumbingServices,
          options: ['Book Plumber', 'View All Services', 'Check Prices']
        }
      });
    }

    if (msg.includes('electr') || msg.includes('wiring') || msg.includes('light')) {
      const electricalServices = await Service.find({ category: 'Electrical' }).limit(3);
      return res.json({
        success: true,
        response: {
          text: "Need electrical work? ⚡ Our electricians can help with:\n\n• Wiring & rewiring\n• Switch/socket installation\n• Light fixture installation\n• Electrical repairs\n\nPrices start from ₹199. Ready to book?",
          services: electricalServices,
          options: ['Book Electrician', 'View All Services', 'Get Quote']
        }
      });
    }

    if (msg.includes('clean') || msg.includes('sweep') || msg.includes('maid')) {
      const cleaningServices = await Service.find({ category: 'Cleaning' }).limit(3);
      return res.json({
        success: true,
        response: {
          text: "Looking for cleaning services? 🧹 We provide:\n\n• Deep cleaning\n• Regular house cleaning\n• Kitchen & bathroom cleaning\n• Office cleaning\n\nPrices start from ₹499. Want to schedule a cleaning?",
          services: cleaningServices,
          options: ['Book Cleaning', 'View Packages', 'Custom Quote']
        }
      });
    }

    if (msg.includes('ac') || msg.includes('air condition') || msg.includes('cooling')) {
      const acServices = await Service.find({ category: 'AC Repair' }).limit(3);
      return res.json({
        success: true,
        response: {
          text: "AC services available! ❄️ We offer:\n\n• AC installation\n• AC repair\n• AC servicing & maintenance\n• Gas refilling\n\nPrices start from ₹349. Need AC service?",
          services: acServices,
          options: ['Book AC Service', 'Get Quote', 'View Services']
        }
      });
    }

    // Pricing
    if (msg.includes('price') || msg.includes('cost') || msg.includes('charge')) {
      const allServices = await Service.find().select('name category price').limit(6);
      return res.json({
        success: true,
        response: {
          text: "Our service pricing is transparent! 💰\n\n• Plumbing: ₹299+\n• Electrical: ₹199+\n• Cleaning: ₹499+\n• Carpentry: ₹399+\n• Painting: ₹599+\n• AC Repair: ₹349+\n\nFinal prices depend on the specific service. Want a detailed quote?",
          services: allServices,
          options: ['Get Custom Quote', 'View All Services', 'Book Service']
        }
      });
    }

    // Booking
    if (msg.includes('book') || msg.includes('schedule') || msg.includes('appointment')) {
      const categories = await Service.distinct('category');
      return res.json({
        success: true,
        response: {
          text: "Great! I can help you book a service. 📅\n\nWhich service do you need?",
          categories: categories,
          showCategories: true
        }
      });
    }

    // View services
    if (msg.includes('service') || msg.includes('view') || msg.includes('show')) {
      const categories = await Service.distinct('category');
      return res.json({
        success: true,
        response: {
          text: "Here are our available services:",
          categories: categories,
          showCategories: true
        }
      });
    }

    // How it works
    if (msg.includes('how') || msg.includes('work') || msg.includes('process')) {
      return res.json({
        success: true,
        response: {
          text: "Here's how ServiceHub works: ✨\n\n1️⃣ Choose your service\n2️⃣ Select date & time\n3️⃣ Confirm booking\n4️⃣ Professional arrives\n5️⃣ Service completed\n6️⃣ Pay & rate\n\nIt's that simple! Ready to book?",
          options: ['Book Now', 'View Services', 'Contact Support']
        }
      });
    }

    // Contact/Support
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help')) {
      return res.json({
        success: true,
        response: {
          text: "Need assistance? 📞 You can reach us:\n\n📧 Email: support@servicehub.com\n📱 Phone: +91 1800-123-4567\n⏰ Available: 24/7\n\nOr continue chatting with me!",
          options: ['Book Service', 'View Services', 'Continue Chat']
        }
      });
    }

    // Greetings
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return res.json({
        success: true,
        response: {
          text: "Hello! 👋 Welcome to ServiceHub. I'm here to help you find and book the perfect service. What do you need today?",
          options: ['Book Service', 'View Services', 'Check Prices', 'How it Works']
        }
      });
    }

    // Thanks
    if (msg.includes('thank') || msg.includes('thanks')) {
      return res.json({
        success: true,
        response: {
          text: "You're welcome! 😊 Is there anything else I can help you with?",
          options: ['Book Service', 'View Services', 'Contact Support']
        }
      });
    }

    // Default response
    return res.json({
      success: true,
      response: {
        text: "I'm here to help! I can assist you with:\n\n🔧 Booking services\n💰 Checking prices\n📅 Scheduling appointments\n❓ Answering questions\n\nWhat would you like to know?",
        options: ['Book Service', 'View Services', 'Check Prices', 'Contact Support']
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat request',
      error: error.message
    });
  }
};

// Get service suggestions based on query
exports.getServiceSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    const services = await Service.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(5);

    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions',
      error: error.message
    });
  }
};

// Save chat history (optional)
exports.saveChatHistory = async (req, res) => {
  try {
    const { userId, messages } = req.body;

    // You can create a ChatHistory model to save conversations
    // For now, just return success

    res.json({
      success: true,
      message: 'Chat history saved'
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving chat history',
      error: error.message
    });
  }
};