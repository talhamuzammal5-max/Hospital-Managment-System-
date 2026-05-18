const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
    nurseId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'], // Forces the shift to be one of these three
    required: true
  },
  // Connects the Nurse to a specific Ward/Room!
  assignedWard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: false
  },
  contactNumber: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Nurse', nurseSchema);