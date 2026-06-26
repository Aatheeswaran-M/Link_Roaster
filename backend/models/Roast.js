const mongoose = require('mongoose');

const roastSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  title: {
    type: String,
  },
  ogImage: {
    type: String,
  },
  summary: {
    type: String,
    required: true,
  },
  interesting: {
    type: String,
    required: true,
  },
  questionable: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for query optimization
roastSchema.index({ user: 1, url: 1 });
roastSchema.index({ createdAt: -1 });
roastSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Roast', roastSchema);
