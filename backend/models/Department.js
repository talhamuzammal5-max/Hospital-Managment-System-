const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // This prevents creating two departments with the same name!
  },
  headOfDepartment: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('Department', departmentSchema);