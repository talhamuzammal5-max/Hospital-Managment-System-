const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Patient = require('./models/Patient'); 
const Doctor = require('./models/Doctor');
const Department = require('./models/Department');
const Appointment = require('./models/Appointment');
const Ward = require('./models/Ward');
const Nurse = require('./models/Nurse');

const app = express();

app.use(cors());
app.use(express.json()); 

// ---------------------------------------------------------
// THE MISSING PIECE: Connect to MongoDB
// ---------------------------------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/hospital')
  .then(() => console.log("SUCCESS: Connected to the LOCAL MongoDB Database!"))
  .catch((err) => console.log("Database Connection Error:", err));
// ---------------------------------------------------------

// Create a simple API route
app.get('/api/status', (req, res) => {
  res.json({ message: "Success! The Node.js Backend is fully operational!" });
});

// 1. ADD a new patient (POST) - UPDATED WITH AUTO-INCREMENT ID
app.post('/api/patients', async (req, res) => {
  try {
    // A. Find the patient with the highest patientId
    const lastPatient = await Patient.findOne().sort({ patientId: -1 });
    
    // B. If a patient exists, add 1 to their ID. Otherwise, start at 1!
    let nextId = 1;
    if (lastPatient && lastPatient.patientId) {
      nextId = lastPatient.patientId + 1;
    }

    // C. Combine the auto-ID with the data from the frontend
    const patientData = { ...req.body, patientId: nextId };
    
    // D. Save to the database
    const newPatient = new Patient(patientData);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Our doorway to VIEW all patients
app.get('/api/patients', async (req, res) => {
  try {
    // Patient.find() tells Mongoose to grab every single patient in the database
    const patients = await Patient.find();
    
    // Send the list of patients back to the user
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE a patient (PUT)
app.put('/api/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a patient (DELETE)
app.delete('/api/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//             DOCTOR ROUTES
// ==========================================

// 1. ADD a new doctor (POST) - UPDATED WITH AUTO-INCREMENT ID
app.post('/api/doctors', async (req, res) => {
  try {
    const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });
    
    let nextId = 1;
    if (lastDoctor && lastDoctor.doctorId) {
      nextId = lastDoctor.doctorId + 1;
    }

    const doctorData = { ...req.body, doctorId: nextId };
    
    const newDoctor = new Doctor(doctorData);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. VIEW all doctors (GET)
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE a doctor (PUT)
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a doctor (DELETE)
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Doctor successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//           DEPARTMENT ROUTES
// ==========================================

// 1. ADD a new department (POST)
app.post('/api/departments', async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. VIEW all departments (GET)
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE a department (PUT)
app.put('/api/departments/:id', async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a department (DELETE)
app.delete('/api/departments/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Department successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//          APPOINTMENT ROUTES
// ==========================================

// 1. ADD a new appointment (POST)
app.post('/api/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. VIEW all appointments (GET)
app.get('/api/appointments', async (req, res) => {
  try {
    // .populate() fetches the actual patient and doctor data, not just their IDs!
    const appointments = await Appointment.find()
      .populate('patientId', 'name age') 
      .populate('doctorId', 'name specialization');
      
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE an appointment (PUT)
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE an appointment (DELETE)
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//              WARD ROUTES
// ==========================================

// 1. ADD a new ward/room (POST)
app.post('/api/wards', async (req, res) => {
  try {
    const newWard = new Ward(req.body);
    const savedWard = await newWard.save();
    res.status(201).json(savedWard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. VIEW all wards/rooms (GET)
app.get('/api/wards', async (req, res) => {
  try {
    const wards = await Ward.find();
    res.status(200).json(wards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE a ward/room (PUT)
app.put('/api/wards/:id', async (req, res) => {
  try {
    const updatedWard = await Ward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedWard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a ward/room (DELETE)
app.delete('/api/wards/:id', async (req, res) => {
  try {
    await Ward.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ward successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//               NURSE ROUTES
// ==========================================

// 1. ADD a new nurse (POST) - UPDATED WITH AUTO-INCREMENT ID
app.post('/api/nurses', async (req, res) => {
  try {
    const lastNurse = await Nurse.findOne().sort({ nurseId: -1 });
    
    let nextId = 1;
    if (lastNurse && lastNurse.nurseId) {
      nextId = lastNurse.nurseId + 1;
    }

    const nurseData = { ...req.body, nurseId: nextId };
    
    const newNurse = new Nurse(nurseData);
    const savedNurse = await newNurse.save();
    res.status(201).json(savedNurse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/nurses', async (req, res) => {
  try {
    // Populate pulls in the actual Ward name instead of just the ID!
    const nurses = await Nurse.find().populate('assignedWard', 'wardName roomNumber');
    res.status(200).json(nurses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/nurses/:id', async (req, res) => {
  try {
    const updatedNurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedNurse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/nurses/:id', async (req, res) => {
  try {
    await Nurse.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Nurse successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
//          DASHBOARD LIVE COUNTS
// ==========================================

app.get('/api/dashboard/counts', async (req, res) => {
  try {
    // 1. Tell Mongoose to count the documents in every single collection
    const patientCount = await Patient.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const departmentCount = await Department.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const wardCount = await Ward.countDocuments();
    const nurseCount = await Nurse.countDocuments();

    // 2. Send all the counts back together in one JSON object
    res.status(200).json({
      patients: patientCount,
      doctors: doctorCount,
      departments: departmentCount,
      appointments: appointmentCount,
      wards: wardCount,
      nurses: nurseCount
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard counts", error: error.message });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Backend server is running on mongodb+srv://admin:hospital123@hospitalcluster.vfjtnrn.mongodb.net/?appName=HospitalCluster");
});