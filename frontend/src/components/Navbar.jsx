import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0, color: 'white' }}>🏥 Hospital Admin</h2>
      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>Dashboard</Link>
        <Link to="/patients" style={linkStyle}>Patients</Link>
        <Link to="/doctors" style={linkStyle}>Doctors</Link>
        <Link to="/appointments" style={linkStyle}>Appointments</Link>
        {/* Here are the two new links! */}
        <Link to="/wards" style={linkStyle}>Wards</Link>
        <Link to="/nurses" style={linkStyle}>Nurses</Link>
      </div>
    </nav>
  );
}

const navStyle = {
  backgroundColor: '#005f73',
  padding: '15px 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const linkContainerStyle = {
  display: 'flex',
  gap: '20px'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: '0.3s'
};

export default Navbar;