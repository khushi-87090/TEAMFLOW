import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Delete the secure token
    navigate('/login'); // Kick them back to the login screen
  };

  // Don't show the navbar if they aren't logged in
  if (!token) return null; 

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 20px', 
      backgroundColor: '#0056b3', 
      color: 'white',
      marginBottom: '20px'
    }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TeamFlow</Link>
      </h2>
      <button 
        onClick={handleLogout} 
        style={{ 
          padding: '8px 15px', 
          backgroundColor: '#ff4d4f', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}>
        Logout
      </button>
    </nav>
  );
}