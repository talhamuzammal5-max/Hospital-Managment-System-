import { useState, useEffect } from 'react';
import axios from 'axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Holds our search text
  
  const [formData, setFormData] = useState({
    name: '', age: '', symptoms: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get('https://hospital-backend-fpfo.onrender.com/api/patients')
      .then((response) => setPatients(response.data))
      .catch((error) => console.log("Error fetching patients:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://hospital-backend-fpfo.onrender.com/api/patients', formData)
      .then(() => {
        setFormData({ name: '', age: '', symptoms: '' });
        fetchPatients();
      })
      .catch((error) => console.log("Error adding patient:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      axios.delete(`https://hospital-backend-fpfo.onrender.com/api/patients/${id}`)
        .then(() => fetchPatients())
        .catch((error) => console.log("Error deleting patient:", error));
    }
  };

  // --- NEW: FILTER LOGIC ---
  // This looks at our list of patients and only keeps the ones that match our search!
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = patient.name.toLowerCase().includes(searchLower);
    // Convert the ID to a string to check if it matches the search bar
    const idMatch = patient.patientId && patient.patientId.toString() === searchTerm; 
    
    return nameMatch || idMatch; // Keep it if EITHER the name or ID matches
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845' }}>Patient Management</h1>

      {/* --- ADD PATIENT FORM --- */}
      <div style={cardStyle}>
        <h3>Add New Patient</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" name="name" placeholder="Patient Name" 
            value={formData.name} onChange={handleChange} required style={inputStyle} 
          />
          <input 
            type="number" name="age" placeholder="Age" 
            value={formData.age} onChange={handleChange} required style={inputStyle} 
          />
          <input 
            type="text" name="symptoms" placeholder="Symptoms" 
            value={formData.symptoms} onChange={handleChange} required style={inputStyle} 
          />
          <button type="submit" style={btnStyle}>Add Patient</button>
        </form>
      </div>

      {/* --- SEARCH BAR AND PATIENT LIST --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Current Patients</h3>
          {/* THE SEARCH INPUT */}
          <input 
            type="text" 
            placeholder="Search by Name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{...inputStyle, maxWidth: '300px', border: '2px solid #0a9396'}}
          />
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #ddd' }}>
              <th style={thStyle}>ID</th> {/* NEW ID COLUMN */}
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Age</th>
              <th style={thStyle}>Symptoms</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* We map over filteredPatients instead of all patients! */}
            {filteredPatients.map((patient) => (
              <tr key={patient._id} style={{ borderBottom: '1px solid #eee' }}>
                {/* Fallback to 'N/A' for old patients added before we created patientId */}
                <td style={{...tdStyle, fontWeight: 'bold', color: '#0a9396'}}>
                  {patient.patientId ? `#${patient.patientId}` : 'N/A'}
                </td>
                <td style={tdStyle}>{patient.name}</td>
                <td style={tdStyle}>{patient.age}</td>
                <td style={tdStyle}>{patient.symptoms}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(patient._id)} style={deleteBtnStyle}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Show a friendly message if the search finds nothing */}
        {filteredPatients.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No patients found matching "{searchTerm}"
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
  padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1
};
const btnStyle = {
  padding: '10px 20px', backgroundColor: '#0a9396', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};
const deleteBtnStyle = {
  padding: '6px 12px', backgroundColor: '#ae2012', color: 'white',
  border: 'none', borderRadius: '4px', cursor: 'pointer'
};
const thStyle = { padding: '12px' };
const tdStyle = { padding: '12px' };

export default Patients;