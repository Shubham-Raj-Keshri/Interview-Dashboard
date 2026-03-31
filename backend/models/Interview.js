const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidate_name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  status: { type: String, enum: ['pending', 'scheduled', 'completed'], default: 'pending' },
  date: { type: Date, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Compound indexes for the most common query patterns
interviewSchema.index({ user: 1, date: -1 });
interviewSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
