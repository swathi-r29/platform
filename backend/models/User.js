const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'worker', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  profileImage: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  location: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// CORRECTED PRE-SAVE HOOK
userSchema.pre('save', function(next) {
  (async () => {
    try {
      console.log('🔐 Pre-save hook triggered');
      console.log('   Password modified:', this.isModified('password'));

      // Only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) {
        console.log('   Password not modified, skipping hash');
        return next();
      }

      // Skip if no password (Google auth users)
      if (!this.password) {
        console.log('   No password, skipping hash');
        return next();
      }

      // Don't hash if password is already hashed
      if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
        console.log('   Password already hashed, skipping');
        return next();
      }

      console.log('   Hashing password...');
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('   ✅ Password hashed successfully');

      next();
    } catch (error) {
      console.error('   ❌ Error in pre-save hook:', error);
      next(error);
    }
  })();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);