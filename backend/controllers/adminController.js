
const Settings = require('../models/Settings');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all workers
const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password').sort('-createdAt');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('service', 'name price')
      .populate('worker', 'name phone email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalWorkers,
      totalBookings,
      completedBookings,
      pendingBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent bookings
const getRecentBookings = async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('worker', 'name')
      .sort('-createdAt')
      .limit(10);
    res.json(recentBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        systemNotifications: true,
        emailAlerts: true,
        maintenanceMode: false,
        allowNewRegistrations: true,
        defaultCommissionRate: 10,
        supportEmail: 'support@servicehub.com',
        systemTimezone: 'UTC',
        backupFrequency: 'daily'
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin settings
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(updates);
    } else {
      Object.keys(updates).forEach(key => {
        settings[key] = updates[key];
      });
    }

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllWorkers,
  getAllBookings,
  getAnalytics,
  getRecentBookings,
  deleteUser,
  getSettings,
  updateSettings
};
