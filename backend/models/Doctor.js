const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorId: {
    type: Number,
    unique: true,
    },
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String, // e.g., "Cardiologist", "Neurologist", "Pediatrician"
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateHired: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);