import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

// Add healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const games = new Map();
const players = new Map();

io.on('connection', (socket) => {
  const { playerName } = socket.handshake.auth;
  
  // Store player info
  players.set(socket.id, {
    id: socket.id,
    name: playerName,
    lastActive: Date.now()
  });

  // Broadcast new player to others
  socket.broadcast.emit('playerJoined', {
    id: socket.id,
    name: playerName
  });

  // Handle task completion
  socket.on('completeTask', ({ playerId, taskId }) => {
    const player = players.get(playerId);
    if (player) {
      player.lastActive = Date.now();
      io.emit('taskCompleted', { playerId, taskId });
    }
  });

  // Handle accusations
  socket.on('accusePlayer', ({ accuserId, accusedId }) => {
    const accuser = players.get(accuserId);
    const accused = players.get(accusedId);
    
    if (accuser && accused) {
      accuser.lastActive = Date.now();
      accused.lastActive = Date.now();
      
      // In a real implementation, we'd verify if the accusation was correct
      // based on recent task completions. For now, randomize it
      const wasCorrect = Math.random() > 0.5;
      
      io.emit('playerAccused', {
        accuserId,
        accusedId,
        wasCorrect
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      players.delete(socket.id);
      io.emit('playerLeft', socket.id);
    }
  });
});

// Clean up inactive players
setInterval(() => {
  const now = Date.now();
  for (const [socketId, player] of players.entries()) {
    if (now - player.lastActive > 30000) { // 30 seconds
      players.delete(socketId);
      io.emit('playerLeft', socketId);
    }
  }
}, 10000);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});