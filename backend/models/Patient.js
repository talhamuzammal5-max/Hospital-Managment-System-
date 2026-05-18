const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true, 
  },
  age: {
    type: Number,
    required: true,
  },
  symptoms: {
    type: String,
    required: false, 
  },
  admissionDate: {
    type: Date,
    default: Date.now, 
  }
});

module.exports = mongoose.model('Patient', patientSchema);