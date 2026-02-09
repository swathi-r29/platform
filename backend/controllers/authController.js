const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token with debugging
const generateToken = (id) => {
  try {
    console.log('🔑 Generating token...');
    console.log('   User ID:', id);
    console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('   JWT_SECRET value:', process.env.JWT_SECRET);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    console.log('✅ Token generated successfully');
    return token;
  } catch (error) {
    console.error('💥 Token generation error:', error);
    throw error;
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('📝 REGISTRATION ATTEMPT STARTED');
    console.log('========================================');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, phone, role, skills, location, address } = req.body;

    // Step 1: Basic validation
    console.log('\n1️⃣ Checking required fields...');
    if (!name || !email || !password || !phone) {
      console.log('❌ Missing required fields');
      console.log('   name:', !!name);
      console.log('   email:', !!email);
      console.log('   password:', !!password);
      console.log('   phone:', !!phone);
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    console.log('✅ All required fields present');

    // Step 2: Email validation
    console.log('\n2️⃣ Validating email format...');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }
    console.log('✅ Email format valid');

    // Step 3: Phone validation
    console.log('\n3️⃣ Validating phone format...');
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    console.log('   Original phone:', phone);
    console.log('   Cleaned phone:', cleanPhone);
    if (!phoneRegex.test(cleanPhone)) {
      console.log('❌ Invalid phone format');
      return res.status(400).json({ message: 'Invalid phone number format (10-15 digits)' });
    }
    console.log('✅ Phone format valid');

    // Step 4: Password validation
    console.log('\n4️⃣ Validating password...');
    if (password.length < 6) {
      console.log('❌ Password too short:', password.length, 'characters');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    console.log('✅ Password length valid:', password.length, 'characters');

    // Step 5: Prevent admin registration
    console.log('\n5️⃣ Checking role...');
    if (role === 'admin') {
      console.log('❌ Admin registration blocked');
      return res.status(400).json({ message: 'Cannot register as admin' });
    }
    console.log('✅ Role is valid:', role || 'user');

    // Step 6: Check if user exists
    console.log('\n6️⃣ Checking if user exists...');
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    console.log('✅ Email is available');

    // Step 7: Prepare user data
    console.log('\n7️⃣ Preparing user data...');
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      role: role || 'user'
    };

    // Add role-specific fields
    if (role === 'worker') {
      console.log('   Configuring worker-specific fields...');
      
      // Handle skills
      if (skills) {
        if (Array.isArray(skills)) {
          userData.skills = skills.filter(s => s && s.trim());
        } else if (typeof skills === 'string') {
          userData.skills = skills.split(',').map(s => s.trim()).filter(s => s);
        } else {
          userData.skills = [];
        }
      } else {
        userData.skills = [];
      }
      
      userData.location = location || '';
      userData.isAvailable = true;
      
      console.log('   Skills:', userData.skills);
      console.log('   Location:', userData.location);
    } else {
      userData.address = address || '';
      console.log('   Address:', userData.address);
    }
    
    console.log('✅ User data prepared');
    console.log('   Final data:', { ...userData, password: '***HIDDEN***' });

    // Step 8: Create user
    console.log('\n8️⃣ Creating user in database...');
    const user = await User.create(userData);
    console.log('✅ User created successfully!');
    console.log('   User ID:', user._id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);

    // Step 9: Generate token
    console.log('\n9️⃣ Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated');

    // Step 10: Send response
    console.log('\n🔟 Sending response...');
    const response = {
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ...(user.role === 'worker' && { 
        skills: user.skills, 
        location: user.location,
        isAvailable: user.isAvailable
      }),
      ...(user.role === 'user' && { 
        address: user.address 
      }),
      token
    };

    console.log('✅ SUCCESS! Registration completed');
    console.log('========================================\n');
    
    return res.status(201).json(response);
    
  } catch (error) {
    console.log('\n========================================');
    console.error('💥 REGISTRATION ERROR:');
    console.log('========================================');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    // Log full error object for mongoose errors
    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
    }
    
    console.error('Stack Trace:', error.stack);
    console.log('========================================\n');
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      success: false,
      message: 'Server error during registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('\n🔐 Login Request for:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Login successful for:', user.email);

    const token = generateToken(user._id);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      ...(user.role === 'worker' && { 
        skills: user.skills, 
        location: user.location,
        isAvailable: user.isAvailable,
        rating: user.rating,
        reviewCount: user.reviewCount,
        earnings: user.earnings
      }),
      ...(user.role === 'user' && { 
        address: user.address 
      }),
      token
    });
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    console.log('\n👑 Admin Login Request for:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('❌ No admin found in system');
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found. Please create admin first.' 
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'admin' 
    });

    if (!user) {
      console.log('❌ Admin user not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      console.log('❌ Admin password incorrect');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }

    console.log('✅ Admin login successful');

    const token = generateToken(user._id);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('💥 ADMIN LOGIN ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during admin login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      throw new Error('User not found in request');
    }

    console.log('✅ Google auth successful for:', user.email);

    const token = generateToken(user._id);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect(
      `${frontendUrl}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
    );
  } catch (error) {
    console.error('💥 GOOGLE AUTH CALLBACK ERROR:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=authentication_failed`);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('💥 GET ME ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (user.role === 'worker') {
      user.skills = req.body.skills || user.skills;
      user.location = req.body.location || user.location;
      if (req.body.isAvailable !== undefined) {
        user.isAvailable = req.body.isAvailable;
      }
    } else {
      user.address = req.body.address || user.address;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: 'Password must be at least 6 characters' 
        });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profileImage: updatedUser.profileImage,
      ...(updatedUser.role === 'worker' && { 
        skills: updatedUser.skills, 
        location: updatedUser.location,
        isAvailable: updatedUser.isAvailable
      }),
      ...(updatedUser.role === 'user' && { 
        address: updatedUser.address 
      }),
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    console.error('💥 UPDATE PROFILE ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  register, 
  login, 
  adminLogin, 
  googleAuthCallback,
  getMe,
  updateProfile
};