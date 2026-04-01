require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const incidentsRoute = require('./routes/incidents');
const complaintsRoute = require('./routes/complaints');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const { initializeRealtime } = require('./realtime');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

initializeRealtime(io);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/incidents', incidentsRoute);
app.use('/api/complaints', complaintsRoute);
app.use('/api/users', usersRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚔 Police Dashboard Backend running on port ${PORT}`);
});
