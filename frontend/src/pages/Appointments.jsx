import { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  // 1. We need THREE states here: Appointments, Patients, and Doctors!
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', appointmentDate: '', reason: '', status: 'Scheduled'
  });

  // 2. Fetch all three databases the moment the page loads
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = () => {
    axios.get('http://localhost:5000/api/appointments')
      .then((response) => setAppointments(response.data))
      .catch((error) => console.log("Error fetching appointments:", error));
  };

  const fetchPatients = () => {
    axios.get('http://localhost:5000/api/patients')
      .then((response) => setPatients(response.data))
      .catch((error) => console.log("Error fetching patients:", error));
  };

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/api/doctors')
      .then((response) => setDoctors(response.data))
      .catch((error) => console.log("Error fetching doctors:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/appointments', formData)
      .then(() => {
        setFormData({ patientId: '', doctorId: '', appointmentDate: '', reason: '', status: 'Scheduled' });
        fetchAppointments(); // Refresh the table!
      })
      .catch((error) => console.log("Error adding appointment:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Cancel and delete this appointment?")) {
      axios.delete(`http://localhost:5000/api/appointments/${id}`)
        .then(() => fetchAppointments())
        .catch((error) => console.log("Error deleting appointment:", error));
    }
  };

  // 3. Search filter (Searches by Patient Name or Doctor Name)
  const filteredAppointments = appointments.filter((appt) => {
    const searchLower = searchTerm.toLowerCase();
    // Using ?. optional chaining just in case a patient or doctor was deleted
    const patientMatch = appt.patientId?.name?.toLowerCase().includes(searchLower) || false;
    const doctorMatch = appt.doctorId?.name?.toLowerCase().includes(searchLower) || false;
    return patientMatch || doctorMatch; 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845' }}>Appointment Management</h1>

      {/* --- ADD APPOINTMENT FORM --- */}
      <div style={cardStyle}>
        <h3>Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* Dropdown for Patients */}
          <select name="patientId" value={formData.patientId} onChange={handleChange} required style={inputStyle}>
            <option value="" disabled>-- Select Patient --</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} (ID: #{p.patientId || 'N/A'})</option>
            ))}
          </select>

          {/* Dropdown for Doctors */}
          <select name="doctorId" value={formData.doctorId} onChange={handleChange} required style={inputStyle}>
            <option value="" disabled>-- Select Doctor --</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
            ))}
          </select>

          {/* Date and Time Picker */}
          <input 
            type="datetime-local" name="appointmentDate" 
            value={formData.appointmentDate} onChange={handleChange} required style={inputStyle} 
          />

          <input 
            type="text" name="reason" placeholder="Reason (e.g., Checkup)" 
            value={formData.reason} onChange={handleChange} required style={inputStyle} 
          />

          <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button type="submit" style={btnStyle}>Book Appointment</button>
        </form>
      </div>

      {/* --- APPOINTMENTS TABLE --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Upcoming Appointments</h3>
          <input 
            type="text" 
            placeholder="Search by Patient or Doctor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{...inputStyle, maxWidth: '300px', border: '2px solid #0a9396'}}
          />
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #ddd' }}>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{...tdStyle, fontWeight: 'bold'}}>
                  {new Date(appt.appointmentDate).toLocaleString()}
                </td>
                <td style={tdStyle}>{appt.patientId?.name || <span style={{color:'red'}}>Deleted Patient</span>}</td>
                <td style={tdStyle}>{appt.doctorId?.name || <span style={{color:'red'}}>Deleted Doctor</span>}</td>
                <td style={tdStyle}>{appt.reason}</td>
                <td style={tdStyle}>
                  <span style={getStatusStyle(appt.status)}>{appt.status}</span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(appt._id)} style={deleteBtnStyle}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAppointments.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
}

// --- STYLING ---
const cardStyle = {
  backgroundColor: 'white', padding: '25px', borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px'
};
const inputStyle = {
  padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 1 200px'
};
const btnStyle = {
  padding: '10px 20px', backgroundColor: '#0a9396', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: '1 1 100%'
};
const deleteBtnStyle = {
  padding: '6px 12px', backgroundColor: '#ae2012', color: 'white',
  border: 'none', borderRadius: '4px', cursor: 'pointer'
};
const thStyle = { padding: '12px' };
const tdStyle = { padding: '12px' };

// A cool little helper function to color-code the status!
const getStatusStyle = (status) => {
  let color = 'gray';
  if (status === 'Scheduled') color = '#0a9396';
  if (status === 'Completed') color = '#2a9d8f';
  if (status === 'Cancelled') color = '#ae2012';
  return { color: color, fontWeight: 'bold', backgroundColor: `${color}20`, padding: '4px 8px', borderRadius: '12px' };
};

export default Appointments;