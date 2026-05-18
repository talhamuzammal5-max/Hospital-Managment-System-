import { useState, useEffect } from 'react';
import axios from 'axios';

function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [wards, setWards] = useState([]); // Needed for the assignment dropdown!
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', shift: 'Morning', assignedWard: '', contactNumber: ''
  });

  useEffect(() => {
    fetchNurses();
    fetchWards();
  }, []);

  const fetchNurses = () => {
    axios.get('http://localhost:5000/api/nurses')
      .then((response) => setNurses(response.data))
      .catch((error) => console.log("Error fetching nurses:", error));
  };

  const fetchWards = () => {
    axios.get('http://localhost:5000/api/wards')
      .then((response) => setWards(response.data))
      .catch((error) => console.log("Error fetching wards:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/nurses', formData)
      .then(() => {
        setFormData({ name: '', shift: 'Morning', assignedWard: '', contactNumber: '' });
        fetchNurses();
      })
      .catch((error) => console.log("Error adding nurse:", error.response?.data?.message || error.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this nurse?")) {
      axios.delete(`http://localhost:5000/api/nurses/${id}`)
        .then(() => fetchNurses())
        .catch((error) => console.log("Error deleting nurse:", error));
    }
  };

  const filteredNurses = nurses.filter((nurse) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = nurse.name.toLowerCase().includes(searchLower);
    const idMatch = nurse.nurseId && nurse.nurseId.toString() === searchTerm; 
    return nameMatch || idMatch; 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845' }}>Nurse & Staff Management</h1>

      {/* --- ADD NURSE FORM --- */}
      <div style={cardStyle}>
        <h3>Add New Nurse</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          
          <input 
            type="text" name="name" placeholder="Nurse Name" 
            value={formData.name} onChange={handleChange} required style={inputStyle} 
          />

          <select name="shift" value={formData.shift} onChange={handleChange} style={inputStyle}>
            <option value="Morning">Morning Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="Night">Night Shift</option>
          </select>

          {/* Dropdown to pick a specific ward! */}
          <select name="assignedWard" value={formData.assignedWard} onChange={handleChange} style={inputStyle}>
            <option value="">-- No Specific Ward --</option>
            {wards.map(w => (
              <option key={w._id} value={w._id}>{w.wardName} (Room {w.roomNumber})</option>
            ))}
          </select>

          <input 
            type="text" name="contactNumber" placeholder="Contact Number" 
            value={formData.contactNumber} onChange={handleChange} required style={inputStyle} 
          />

          <button type="submit" style={btnStyle}>Add Nurse</button>
        </form>
      </div>

      {/* --- NURSES TABLE --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Current Staff</h3>
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
              <th style={thStyle}>Shift</th>
              <th style={thStyle}>Assigned Ward</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNurses.map((nurse) => (
              <tr key={nurse._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{...tdStyle, fontWeight: 'bold', color: '#0a9396'}}>
                  {nurse.nurseId ? `#${nurse.nurseId}` : 'N/A'}
                </td>
                <td style={tdStyle}>{nurse.name}</td>
                <td style={tdStyle}>
                  {/* Beautiful color-coded shift badges! */}
                  <span style={getShiftStyle(nurse.shift)}>{nurse.shift}</span>
                </td>
                <td style={tdStyle}>
                  {nurse.assignedWard ? `${nurse.assignedWard.wardName} (${nurse.assignedWard.roomNumber})` : <span style={{color: '#888'}}>Floating</span>}
                </td>
                <td style={tdStyle}>{nurse.contactNumber}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(nurse._id)} style={deleteBtnStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredNurses.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No nurses found matching "{searchTerm}"
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

// Color-coding the shifts makes the UI pop
const getShiftStyle = (shift) => {
  if (shift === 'Morning') return { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' };
  if (shift === 'Evening') return { backgroundColor: '#ffe5d9', color: '#d00000', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' };
  if (shift === 'Night') return { backgroundColor: '#cbe4f9', color: '#03045e', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' };
  return {};
};

export default Nurses;