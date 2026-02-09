const User = require('../models/User');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const { notifyBookingAccepted, notifyBookingRejected, notifyServiceCompleted } = require('../utils/notificationHelper');

const getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id).select('-password');
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkerProfile = async (req, res) => {
  try {
    console.log('=== UPDATE PROFILE START ===');
    console.log('User ID:', req.user._id);
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    // Validation
    if (!req.body.name || req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!req.body.phone || req.body.phone.trim() === '') {
      return res.status(400).json({ message: 'Phone is required' });
    }
    if (!req.body.location || req.body.location.trim() === '') {
      return res.status(400).json({ message: 'Location is required' });
    }

    // Build update object
    const updateData = {
      name: req.body.name.trim(),
      phone: req.body.phone.trim(),
      location: req.body.location.trim()
    };

    // Handle skills
    if (req.body.skills) {
      try {
        const parsedSkills = JSON.parse(req.body.skills);
        updateData.skills = Array.isArray(parsedSkills) ? parsedSkills : [];
      } catch (e) {
        console.error('Skills parse error:', e);
        return res.status(400).json({ message: 'Invalid skills format' });
      }
    }

    // Handle isAvailable
    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }

    // Handle profile image
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    console.log('Update data (without password):', updateData);

    // Update worker WITHOUT password first
    const worker = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    console.log('Worker updated (without password)');

    // Handle password separately if provided
    if (req.body.password && req.body.password.trim() !== '') {
      console.log('Updating password...');
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password.trim(), salt);
        
        await User.findByIdAndUpdate(req.user._id, { 
          password: hashedPassword 
        });
        
        console.log('Password updated successfully');
      } catch (passError) {
        console.error('Password update error:', passError);
        // Don't fail the whole request if password update fails
        // The other fields were already updated
      }
    }

    console.log('=== UPDATE PROFILE SUCCESS ===');

    res.json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      location: worker.location,
      skills: worker.skills,
      isAvailable: worker.isAvailable,
      profileImage: worker.profileImage,
      role: worker.role
    });

  } catch (error) {
    console.error('=== UPDATE PROFILE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate field value',
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ worker: req.user._id })
      .populate('service')
      .populate('user', 'name phone email address')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('user', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'accepted';
    await booking.save();

    await notifyBookingAccepted(
      booking.user._id,
      booking._id,
      req.user.name,
      booking.service.name
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('user', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'rejected';
    await booking.save();

    await notifyBookingRejected(
      booking.user._id,
      booking._id,
      req.user.name,
      booking.service.name
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('user', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    booking.status = 'completed';
    await booking.save();

    const worker = await User.findById(req.user._id);
    worker.earnings += booking.totalAmount;
    await worker.save();

    await notifyServiceCompleted(
      booking.user._id,
      booking._id,
      booking.service.name
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkerEarnings = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);
    const completedBookings = await Booking.find({
      worker: req.user._id,
      status: 'completed'
    });

    res.json({
      totalEarnings: worker.earnings,
      completedBookings: completedBookings.length,
      rating: worker.rating,
      reviewCount: worker.reviewCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkerProfile,
  updateWorkerProfile,
  getWorkerBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getWorkerEarnings
};