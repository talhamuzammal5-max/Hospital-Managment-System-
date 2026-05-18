const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardName: {
    type: String, // e.g., "ICU", "General", "Maternity"
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Ward', wardSchema);