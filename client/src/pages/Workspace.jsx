const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5002/api/teams/${id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });
      
      const data = await response.json();
      alert(data.message || data.error); // Show success or error popup
      if (response.ok) setInviteEmail('');
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };