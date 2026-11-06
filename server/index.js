const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// NEW: Import http and socket.io
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks'); 
const messageRoutes = require('./routes/messages');

const app = express();

// NEW: Create an HTTP server and attach Socket.io to it
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your React app to connect
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

// NEW: Real-time Socket.io logic
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // When a user opens a team workspace, they join a "room" for that specific team
  socket.on('join_team', (teamId) => {
    socket.join(teamId);
    console.log(`User with ID: ${socket.id} joined room: ${teamId}`);
  });

  // When a user sends a message, forward it to everyone else in that specific team room
  socket.on('send_message', (data) => {
    socket.to(data.team).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5002;
// NEW: Change app.listen to server.listen so sockets work!
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});