const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // This connects to the specific Patient's unique ID
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', 
    required: true
  },
  // This connects to the specific Doctor's unique ID
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'], // Only allows these specific words
    default: 'Scheduled'
  },
  reason: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);