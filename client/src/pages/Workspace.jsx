import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function Workspace() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // Task State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch both tasks and messages when the page loads
  useEffect(() => {
    fetchTasks();
    fetchMessages();
  }, [id]);

  // --- TASK FUNCTIONS ---
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const response = await fetch(`http://127.0.0.1:5002/api/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setTasks(await response.json());
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
        fetchTasks(); 
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5002/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchTasks(); 
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // --- CHAT FUNCTIONS ---
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5002/api/messages/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setMessages(await response.json());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5002/api/messages/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); 
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'blue', marginBottom: '20px', display: 'block' }}>
        &larr; Back to Dashboard
      </Link>
      
      <h2>Team Workspace</h2>
      <hr style={{ marginBottom: '20px' }}/>

      {/* Main Layout: Two Columns */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: TASKS (60% width) */}
        <div style={{ flex: '6' }}>
          <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
            <h3>Create a New Task</h3>
            <form onSubmit={handleCreateTask}>
              <input 
                type="text" placeholder="Task Title" value={title} 
                onChange={(e) => setTitle(e.target.value)} required 
                style={{ marginRight: '10px' }}
              />
              <input 
                type="text" placeholder="Details (Optional)" value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                style={{ marginRight: '10px' }}
              />
              <button type="submit">Add Task</button>
            </form>
          </div>

          <h3>Task List</h3>
          {tasks.length === 0 ? (
            <p>No tasks yet. Create one above to get started!</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {tasks.map(task => (
                <li key={task._id} style={{ 
                  border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px',
                  backgroundColor: task.status === 'done' ? '#e8f5e9' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{task.title}</strong> 
                      <span style={{ marginLeft: '10px', padding: '2px 8px', backgroundColor: '#e0e0e0', borderRadius: '10px', fontSize: '12px' }}>
                        {task.status}
                      </span>
                      {task.description && <p style={{ margin: '5px 0 0 0', color: '#555' }}>{task.description}</p>}
                    </div>
                    
                    <div>
                      {task.status !== 'todo' && <button onClick={() => handleUpdateStatus(task._id, 'todo')} style={{ marginRight: '5px' }}>Todo</button>}
                      {task.status !== 'in-progress' && <button onClick={() => handleUpdateStatus(task._id, 'in-progress')} style={{ marginRight: '5px' }}>In Progress</button>}
                      {task.status !== 'done' && <button onClick={() => handleUpdateStatus(task._id, 'done')}>Done</button>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT COLUMN: TEAM CHAT (40% width) */}
        <div style={{ flex: '4', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f1f1f1', borderBottom: '1px solid #ccc', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <h3 style={{ margin: 0 }}>Team Activity / Chat</h3>
          </div>
          
          {/* Messages Area */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#fff' }}>
            {messages.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center' }}>No messages yet. Say hello!</p>
            ) : (
              messages.map(msg => (
                <div key={msg._id} style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#0056b3' }}>
                    {msg.sender?.username || msg.sender?.email || 'Unknown User'}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <p style={{ margin: '4px 0 0 0', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #ccc', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              style={{ flex: 1, padding: '8px' }}
            />
            <button type="submit" style={{ padding: '8px 15px' }}>Send</button>
          </form>
        </div>

      </div>
    </div>
  );
}