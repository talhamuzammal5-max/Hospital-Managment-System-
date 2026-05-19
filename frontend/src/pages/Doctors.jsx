import { useState, useEffect } from 'react';
import axios from 'axios';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. ADDED phoneNumber to our starting state
  const [formData, setFormData] = useState({
    name: '', specialization: '', phoneNumber: '' 
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios.get('https://hospital-backend-fpfo.onrender.com/api/doctors')
      .then((response) => setDoctors(response.data))
      .catch((error) => console.log("Error fetching doctors:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://hospital-backend-fpfo.onrender.com/api/doctors', formData)
      .then(() => {
        // 2. ADDED phoneNumber to reset blank after submitting
        setFormData({ name: '', specialization: '', phoneNumber: '' });
        fetchDoctors();
      })
      .catch((error) => console.log("Backend error:", error.response?.data?.message || error.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      axios.delete(`https://hospital-backend-fpfo.onrender.com/api/doctors/${id}`)
        .then(() => fetchDoctors())
        .catch((error) => console.log("Error deleting doctor:", error));
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = doctor.name.toLowerCase().includes(searchLower);
    const idMatch = doctor.doctorId && doctor.doctorId.toString() === searchTerm; 
    return nameMatch || idMatch; 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845' }}>Doctor Management</h1>

      <div style={cardStyle}>
        <h3>Add New Doctor</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" name="name" placeholder="Name (e.g., Dr. Smith)" 
            value={formData.name} onChange={handleChange} required style={inputStyle} 
          />
          <input 
            type="text" name="specialization" placeholder="Specialization" 
            value={formData.specialization} onChange={handleChange} required style={inputStyle} 
          />
          {/* 3. ADDED the Phone Number Input Box */}
          <input 
            type="text" name="phoneNumber" placeholder="Phone Number" 
            value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} 
          />
          <button type="submit" style={btnStyle}>Add Doctor</button>
        </form>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Current Doctors</h3>
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
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Specialization</th>
              <th style={thStyle}>Phone Number</th> {/* 4. ADDED Table Header */}
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{...tdStyle, fontWeight: 'bold', color: '#0a9396'}}>
                  {doctor.doctorId ? `#${doctor.doctorId}` : 'N/A'}
                </td>
                <td style={tdStyle}>{doctor.name}</td>
                <td style={tdStyle}>{doctor.specialization}</td>
                <td style={tdStyle}>{doctor.phoneNumber}</td> {/* 5. ADDED Table Data */}
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(doctor._id)} style={deleteBtnStyle}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredDoctors.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No doctors found matching "{searchTerm}"
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
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap'
};
const deleteBtnStyle = {
  padding: '6px 12px', backgroundColor: '#ae2012', color: 'white',
  border: 'none', borderRadius: '4px', cursor: 'pointer'
};
const thStyle = { padding: '12px' };
const tdStyle = { padding: '12px' };

export default Doctors;