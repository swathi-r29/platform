const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only favorite a service once
favoriteSchema.index({ user: 1, service: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
