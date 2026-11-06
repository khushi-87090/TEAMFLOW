const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks'); 
const messageRoutes = require('./routes/messages');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// NEW: Object to track how many users are in each team room
const teamUsers = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let currentTeam = null;

  // When a user opens a team workspace
  socket.on('join_team', (teamId) => {
    socket.join(teamId);
    currentTeam = teamId;
    
    // Increment the user count for this team
    if (!teamUsers[teamId]) teamUsers[teamId] = 0;
    teamUsers[teamId]++;
    
    console.log(`User ${socket.id} joined room: ${teamId}. Total online: ${teamUsers[teamId]}`);
    
    // Broadcast the new count to everyone in the room (including the person who just joined)
    io.to(teamId).emit('online_users_update', teamUsers[teamId]);
  });

  // When a user sends a message
  socket.on('send_message', (data) => {
    io.to(data.team).emit('receive_message', data);
  });

  // When a user leaves the page or closes the tab
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    
    // Decrement the user count and broadcast the updated number
    if (currentTeam && teamUsers[currentTeam]) {
      teamUsers[currentTeam]--;
      io.to(currentTeam).emit('online_users_update', teamUsers[currentTeam]);
    }
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});