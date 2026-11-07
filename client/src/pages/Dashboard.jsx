import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

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
      
      // UPDATED URL HERE
      const response = await fetch('https://teamflow-backend-5wos.onrender.com/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setTeams(await response.json());
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // UPDATED URL HERE
      const response = await fetch('https://teamflow-backend-5wos.onrender.com/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: teamName })
      });

      if (response.ok) {
        setTeamName('');
        fetchTeams(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#f97316] selection:text-white">
      
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

      <main className="max-w-6xl mx-auto p-6 mt-8">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Your Dashboard</h2>
          <p className="text-[#94a3b8] mt-2 text-lg">Manage your workspaces and collaborate with your team.</p>
        </div>

        {/* Create Team Section */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-12 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316] opacity-5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h3 className="text-xl font-semibold mb-4 text-white relative z-10">Create a New Workspace</h3>
          <form onSubmit={handleCreateTeam} className="flex flex-col sm:flex-row gap-4 relative z-10">
            <input
              type="text"
              placeholder="Team Name (e.g., Marketing, Engineering)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
              required
            />
            <button 
              type="submit" 
              className="bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
            >
              + Create Team
            </button>
          </form>
        </div>

        {/* Teams Grid */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Your Workspaces</h3>
          <span className="bg-[#1e293b] text-[#94a3b8] py-1 px-3 rounded-full text-sm font-medium border border-[#334155]">
            {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
          </span>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-16 bg-[#1e293b]/50 border-2 border-[#334155] rounded-2xl border-dashed">
             <p className="text-[#94a3b8] text-lg">You aren't in any teams yet. Create one above to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <Link key={team._id} to={`/team/${team._id}`} className="block group">
                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 h-full hover:border-[#f97316] hover:shadow-xl hover:-translate-y-1 hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer">
                  
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 group-hover:border-[#f97316] transition-transform text-white">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#f97316] transition-colors">{team.name}</h4>
                  <p className="text-sm text-[#94a3b8] font-medium flex items-center gap-2 mt-4">
                    Enter workspace 
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}