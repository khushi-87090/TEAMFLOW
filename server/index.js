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

// Helper function that allows localhost AND any .vercel.app URL automatically
const checkOrigin = (origin, callback) => {
  if (!origin || origin.startsWith("http://localhost") || origin.endsWith(".vercel.app")) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

// 1. AUTOMATIC SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: checkOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 2. AUTOMATIC EXPRESS CORS
app.use(cors({
  origin: checkOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

const teamUsers = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let currentTeam = null;

  socket.on('join_team', (teamId) => {
    socket.join(teamId);
    currentTeam = teamId;
    if (!teamUsers[teamId]) teamUsers[teamId] = 0;
    teamUsers[teamId]++;
    io.to(teamId).emit('online_users_update', teamUsers[teamId]);
  });

  socket.on('send_message', (data) => {
    io.to(data.team).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
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