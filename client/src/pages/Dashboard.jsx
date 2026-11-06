import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const navigate = useNavigate();

  // Fetch the user's teams as soon as the page loads
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
        return;
      }

      const response = await fetch('http://127.0.0.1:5002/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeams(data); 
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Handle creating a new team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5002/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (response.ok) {
        setName(''); // Clear the input
        setDescription(''); // Clear the input
        fetchTeams(); // Instantly refresh the team list!
      } else {
        alert('Failed to create team.');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to TeamFlow</h1>
      
      {/* Team Creation Form */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Create a New Team</h3>
        <form onSubmit={handleCreateTeam}>
          <input 
            type="text" 
            placeholder="Team Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Description (Optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Create Team</button>
        </form>
      </div>

      {/* Display List of Teams */}
      <h3>Your Workspaces</h3>
      {teams.length === 0 ? (
        <p>You aren't in any teams yet. Create one above!</p>
      ) : (
        <ul>
          {teams.map(team => (
            <li key={team._id} style={{ marginBottom: '10px' }}>
              {/* This is the new clickable link! */}
              <Link to={`/team/${team._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                <strong>{team.name}</strong> 
              </Link>
              {team.description && <span> - {team.description}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}