const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair','Cooking' ,'Other']
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);