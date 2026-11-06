import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function Workspace() {
  const { id } = useParams(); // Gets the team ID from the URL
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks when the page loads
  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch tasks specifically for this team
      const response = await fetch(`http://127.0.0.1:5002/api/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5002/api/tasks/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks(); // Refresh the list so the new task appears instantly
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'blue', marginBottom: '20px', display: 'block' }}>
        &larr; Back to Dashboard
      </Link>
      
      <h2>Team Workspace</h2>
      <hr style={{ marginBottom: '20px' }}/>

      {/* Task Creation Form */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <h3>Create a New Task</h3>
        <form onSubmit={handleCreateTask}>
          <input 
            type="text" 
            placeholder="Task Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Details (Optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      {/* Task Board */}
      <h3>Task List</h3>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create one above to get started!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li key={task._id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              marginBottom: '10px', 
              borderRadius: '5px' 
            }}>
              <strong>{task.title}</strong> 
              <span style={{ marginLeft: '10px', padding: '2px 8px', backgroundColor: '#e0e0e0', borderRadius: '10px', fontSize: '12px' }}>
                {task.status}
              </span>
              {task.description && <p style={{ margin: '5px 0 0 0', color: '#555' }}>{task.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}