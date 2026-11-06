import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace'; // 1. Added Workspace import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Added the new dynamic route for individual teams */}
        <Route path="/team/:id" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;