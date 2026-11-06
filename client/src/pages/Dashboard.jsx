import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Grab the token we saved during login
      const token = localStorage.getItem('token');
      
      // 2. If no token exists, kick them back to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 3. Send the token to the backend bouncer (/me route)
        const response = await fetch('http://localhost:5002/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}` // This matches what our middleware expects
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          // 4. Save the user data to state to display it
          setUser(data);
        } else {
          // If the token is invalid/expired, clear it and redirect
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Show a loading screen while checking the token
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to TeamFlow, {user.name}!</h1>
      <p>Your registered email is: {user.email}</p>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}