import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  // 1. Set up state for your form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // 2. Create the submit handler
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on submit

    try {
      // 3. Send the data to your Node.js backend (UPDATED URL HERE)
      const response = await fetch('https://teamflow-backend-5wos.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // 4. Handle success or error
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.message); // Show error (e.g., "User already exists")
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    // 5. Connect the form submission and input values
    <form onSubmit={handleRegister}>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Register</button>
    </form>
  );
}