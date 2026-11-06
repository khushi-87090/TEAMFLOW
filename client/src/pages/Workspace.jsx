import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:5002'); 

export default function Workspace() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTasks();
    fetchMessages();

    socket.emit('join_team', id);

    socket.on('receive_message', () => {
      fetchMessages();
    });

    return () => {
      socket.off('receive_message');
    };
  }, [id]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        socket.emit('send_message', { team: id }); 
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#f97316] selection:text-white pb-10">
      {/* Navbar */}
      <nav className="bg-[#1e293b] border-b border-[#334155] px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-orange-500 rounded-lg shadow-lg flex items-center justify-center font-bold text-white">
            T
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">TeamFlow</h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl font-medium transition-all duration-200"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 mt-4">
        <Link to="/" className="inline-flex items-center text-[#94a3b8] hover:text-white mb-6 bg-[#1e293b] border border-[#334155] px-4 py-2 rounded-xl transition-colors">
          <span className="mr-2">&larr;</span> Back to Dashboard
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: TASKS */}
          <div className="flex-[6]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Team Workspace</h2>
            </div>

            {/* Create Task Form */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-8 shadow-lg">
              <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <input 
                    type="text" 
                    placeholder="Task Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Details (Optional)" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <button type="submit" className="bg-white text-[#0f172a] hover:bg-gray-200 font-bold py-3 px-8 rounded-xl transition-all h-fit sm:self-center">
                  + Add Task
                </button>
              </form>
            </div>

            <h3 className="text-xl font-bold mb-4">Task List</h3>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-[#1e293b]/50 border-2 border-[#334155] rounded-2xl border-dashed">
                <p className="text-[#94a3b8]">No tasks yet. Create one above to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <div key={task._id} className={`bg-[#1e293b] border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${task.status === 'done' ? 'border-green-500/50 shadow-green-500/5' : task.status === 'in-progress' ? 'border-blue-500/50 shadow-blue-500/5' : 'border-[#334155]'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-white leading-tight">{task.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          task.status === 'done' ? 'bg-green-500/20 text-green-400' : 
                          task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {task.status === 'todo' ? 'Todo' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
                        </span>
                      </div>
                      {task.description && <p className="text-[#94a3b8] text-sm mt-2">{task.description}</p>}
                    </div>
                    
                    <div className="mt-5 flex gap-2 border-t border-[#334155] pt-4">
                      {task.status !== 'todo' && <button onClick={() => handleUpdateStatus(task._id, 'todo')} className="text-xs bg-[#0f172a] hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-[#334155] transition-colors">&larr; Todo</button>}
                      {task.status !== 'in-progress' && <button onClick={() => handleUpdateStatus(task._id, 'in-progress')} className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors">In Progress</button>}
                      {task.status !== 'done' && <button onClick={() => handleUpdateStatus(task._id, 'done')} className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 transition-colors">Done &rarr;</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TEAM CHAT */}
          <div className="flex-[4] flex flex-col h-[700px] bg-[#1e293b] border-2 border-[#3b82f6]/30 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
            <div className="p-5 border-b border-[#334155] bg-[#1e293b]">
              <h3 className="text-lg font-bold text-white">Team Activity / Chat</h3>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto bg-[#0f172a] space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#64748b] text-center">No messages yet.<br/>Break the ice!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className="flex flex-col">
                    <div className="flex items-baseline gap-2 mb-1">
                      <strong className="text-blue-400 text-sm">
                        {msg.sender?.username || msg.sender?.email || 'Unknown User'}
                      </strong>
                      <span className="text-[10px] text-[#64748b]">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="bg-[#1e293b] border border-[#334155] p-3 rounded-2xl rounded-tl-sm text-sm text-slate-200 w-fit max-w-[85%] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {/* Invisible div to help us auto-scroll to the bottom */}
              <div ref={messagesEndRef} /> 
            </div>

            <div className="p-4 bg-[#1e293b] border-t border-[#334155]">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" 
                />
                <button type="submit" className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all">
                  Send
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}