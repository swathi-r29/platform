const Service = require('../models/Service');
const mongoose = require('mongoose');

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    // FIXED: Use categoryName to match route parameter
    const { categoryName } = req.params;
    
    console.log('Fetching services for category:', categoryName);
    
    // Case-insensitive search
    const services = await Service.find({
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    }).sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('workers');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// Create new service (admin only)
exports.createService = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('CREATE SERVICE - START');
    console.log('========================================');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Request File:', req.file);
    console.log('Request User:', req.user ? { id: req.user._id, role: req.user.role, name: req.user.name } : 'NO USER');
    console.log('----------------------------------------');

    const { name, category, price, description, duration, location, workers } = req.body;

    console.log('Extracted fields:');
    console.log('- name:', name);
    console.log('- category:', category);
    console.log('- price:', price);
    console.log('- description:', description?.substring(0, 50) + '...');
    console.log('- duration:', duration);
    console.log('- location:', location);
    console.log('- workers:', workers);

    // Validation
    if (!name || !description || !category || !price || !duration || !location) {
      console.log('❌ VALIDATION FAILED: Missing required fields');
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      console.log('❌ VALIDATION FAILED: Invalid price');
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const numDuration = Number(duration);
    if (isNaN(numDuration) || numDuration <= 0) {
      console.log('❌ VALIDATION FAILED: Invalid duration');
      return res.status(400).json({ message: 'Duration must be a positive number' });
    }

    const validCategories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
    if (!validCategories.includes(category)) {
      console.log('❌ VALIDATION FAILED: Invalid category');
      return res.status(400).json({ message: 'Invalid category' });
    }

    console.log('✅ Basic validation passed');

    let workerIds = [];
    if (workers) {
      workerIds = Array.isArray(workers) ? workers : [workers];
      console.log('Processing worker IDs:', workerIds);

      workerIds = workerIds.map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (error) {
          console.log('❌ VALIDATION FAILED: Invalid worker ID:', id);
          throw new Error(`Invalid worker ID: ${id}`);
        }
      });
      console.log('✅ Worker IDs validated and converted');
    }

    const serviceData = {
      name,
      category,
      price: numPrice,
      description,
      duration: numDuration,
      location
      // workers: workerIds
    };

    if (req.file) {
      serviceData.image = `/uploads/${req.file.filename}`;
      console.log('✅ Image added:', serviceData.image);
    } else {
      console.log('ℹ️  No image uploaded');
    }

    console.log('----------------------------------------');
    console.log('Service data to create:', JSON.stringify(serviceData, null, 2));
    console.log('----------------------------------------');
    console.log('Attempting to create service in database...');

    const service = await Service.create(serviceData);
    
    console.log('✅ SERVICE CREATED SUCCESSFULLY!');
    console.log('Service ID:', service._id);
    console.log('========================================\n');
    
    res.status(201).json(service);
  } catch (error) {
    console.log('\n========================================');
    console.log('❌ ERROR CREATING SERVICE');
    console.log('========================================');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.log('========================================\n');
    
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// Update service (admin only)
exports.updateService = async (req, res) => {
  try {
    const { name, category, price, description, duration, location, workers, isActive } = req.body;

    // Validation
    if (!name || !description || !category || !price || !duration || !location) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const numDuration = Number(duration);
    if (isNaN(numDuration) || numDuration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive number' });
    }

    const validCategories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let workerIds = [];
    if (workers) {
      let parsedWorkers;
      if (typeof workers === 'string') {
        try {
          parsedWorkers = JSON.parse(workers);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid workers data' });
        }
      } else {
        parsedWorkers = workers;
      }
      workerIds = Array.isArray(parsedWorkers) ? parsedWorkers : [parsedWorkers];
      workerIds = workerIds.flat(Infinity);
      workerIds = workerIds.map(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid worker ID: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });
    }

    const updateData = {
      name,
      category,
      price: numPrice,
      description,
      duration: numDuration,
      location,
      workers: workerIds,
      isActive: isActive === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// Delete service (admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};