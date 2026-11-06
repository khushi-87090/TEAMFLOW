import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Navbar from './components/Navbar'; // 1. Import the Navbar

function App() {
  return (
    <BrowserRouter>
      {/* 2. Place the Navbar outside the Routes so it always shows up! */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team/:id" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;