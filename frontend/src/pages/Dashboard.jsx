import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [counts, setCounts] = useState({
    patients: 0, doctors: 0, departments: 0, 
    appointments: 0, wards: 0, nurses: 0
  });

  useEffect(() => {
    axios.get('https://hospital-backend-fpfo.onrender.com/api/dashboard/counts')
      .then((response) => setCounts(response.data))
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#0a3845', marginBottom: '10px' }}>System Overview</h1>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>Live metrics from your hospital databases.</p>
      
      {/* CSS Grid is perfect for aligning cards beautifully */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '25px' 
      }}>
        <StatCard title="Total Patients" count={counts.patients} icon="🩺" color="#0a9396" />
        <StatCard title="Total Doctors" count={counts.doctors} icon="👨‍⚕️" color="#94d2bd" />
        <StatCard title="Appointments" count={counts.appointments} icon="📅" color="#ee9b00" />
        <StatCard title="Nurses on Staff" count={counts.nurses} icon="👩‍⚕️" color="#ca6702" />
        <StatCard title="Departments" count={counts.departments} icon="🏢" color="#bb3e03" />
        <StatCard title="Wards / Rooms" count={counts.wards} icon="🛏️" color="#ae2012" />
      </div>
    </div>
  );
}

// Creating a reusable custom component for our cards
function StatCard({ title, count, icon, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      borderTop: `5px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <h3 style={{ color: '#555', margin: '0 0 10px 0', fontSize: '16px' }}>{title}</h3>
        <h2 style={{ color: '#222', margin: 0, fontSize: '36px' }}>{count}</h2>
      </div>
      <div style={{ fontSize: '45px' }}>{icon}</div>
    </div>
  );
}

export default Dashboard;