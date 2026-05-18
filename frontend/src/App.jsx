import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Wards from './pages/Wards';
import Nurses from './pages/Nurses';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', margin: 0, fontFamily: 'system-ui' }}>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          {/* Here are the two new routes! */}
          <Route path="/wards" element={<Wards />} />
          <Route path="/nurses" element={<Nurses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;