import { useState, useEffect } from 'react';
import axios from 'axios';

function Wards() {
  const [wards, setWards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notice how this matches your backend blueprint perfectly!
  const [formData, setFormData] = useState({
    wardName: '', roomNumber: '', capacity: '', isAvailable: true
  });

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = () => {
    axios.get('http://localhost:5000/api/wards')
      .then((response) => setWards(response.data))
      .catch((error) => console.log("Error fetching wards:", error));
  };

  const handleChange = (e) => {
    // We need a tiny check here because the 'isAvailable' dropdown sends a string, but we need a boolean
    const value = e.target.name === 'isAvailable' ? e.target.value === 'true' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/wards', formData)
      .then(() => {
        setFormData({ wardName: '', roomNumber: '', capacity: '', isAvailable: true });
        fetchWards();
      })
      .catch((error) => console.log("Error adding ward:", error.response?.data?.message || error.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      axios.delete(`http://localhost:5000/api/wards/${id}`)
        .then(() => fetchWards())
        .catch((error) => console.log("Error deleting ward:", error));
    }
  };

  // Search by Ward Name or Room Number
  const filteredWards = wards.filter((ward) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = ward.wardName.toLowerCase().includes(searchLower);
    const roomMatch = ward.roomNumber.toLowerCase().includes(searchLower);
    return nameMatch || roomMatch; 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845' }}>Ward & Room Management</h1>

      {/* --- ADD WARD FORM --- */}
      <div style={cardStyle}>
        <h3>Add New Room</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          <select name="wardName" value={formData.wardName} onChange={handleChange} required style={inputStyle}>
            <option value="" disabled>-- Select Ward Type --</option>
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Maternity">Maternity</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Emergency">Emergency</option>
          </select>

          <input 
            type="text" name="roomNumber" placeholder="Room Number (e.g., 101A)" 
            value={formData.roomNumber} onChange={handleChange} required style={inputStyle} 
          />
          
          <input 
            type="number" name="capacity" placeholder="Bed Capacity" 
            value={formData.capacity} onChange={handleChange} required min="1" style={inputStyle} 
          />

          <select name="isAvailable" value={formData.isAvailable} onChange={handleChange} style={inputStyle}>
            <option value={true}>Available</option>
            <option value={false}>Full / Maintenance</option>
          </select>

          <button type="submit" style={btnStyle}>Add Room</button>
        </form>
      </div>

      {/* --- WARDS TABLE --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Current Rooms</h3>
          <input 
            type="text" 
            placeholder="Search by Ward or Room..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{...inputStyle, maxWidth: '300px', border: '2px solid #0a9396'}}
          />
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #ddd' }}>
              <th style={thStyle}>Ward Type</th>
              <th style={thStyle}>Room Number</th>
              <th style={thStyle}>Capacity</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWards.map((ward) => (
              <tr key={ward._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{...tdStyle, fontWeight: 'bold', color: '#0a3845'}}>{ward.wardName}</td>
                <td style={tdStyle}>{ward.roomNumber}</td>
                <td style={tdStyle}>{ward.capacity} Beds</td>
                <td style={tdStyle}>
                  {/* Beautiful status badges! */}
                  <span style={ward.isAvailable ? availableStyle : fullStyle}>
                    {ward.isAvailable ? 'Available' : 'Full / Unavailable'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(ward._id)} style={deleteBtnStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredWards.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No rooms found matching "{searchTerm}"
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

// Custom styles for the beautiful status badges
const availableStyle = {
  backgroundColor: '#d8f3dc', color: '#1b4332', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px'
};
const fullStyle = {
  backgroundColor: '#ffddd2', color: '#9d0208', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px'
};

export default Wards;