import { io } from 'socket.io-client';
import useStore from '../store';
import toast from 'react-hot-toast';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.up.railway.app'  // Replace with your Railway URL
  : 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});

socket.on('connect', () => {
  toast.success('Connected to game server!');
});

socket.on('disconnect', () => {
  toast.error('Disconnected from game server');
});

socket.on('playerJoined', (player) => {
  useStore.getState().addPlayer(player.name);
  toast.success(`${player.name} joined the game!`);
});

socket.on('playerLeft', (playerId) => {
  const players = useStore.getState().players;
  const player = players.find(p => p.id === playerId);
  if (player) {
    toast.error(`${player.name} left the game`);
  }
});

socket.on('taskCompleted', ({ playerId, taskId }) => {
  useStore.getState().completeTask(playerId, taskId);
});

socket.on('playerAccused', ({ accuserId, accusedId, wasCorrect }) => {
  const players = useStore.getState().players;
  const accuser = players.find(p => p.id === accuserId);
  const accused = players.find(p => p.id === accusedId);
  
  if (accuser && accused) {
    toast[wasCorrect ? 'success' : 'error'](
      `${accuser.name} ${wasCorrect ? 'caught' : 'wrongly accused'} ${accused.name}!`
    );
  }
});

export const connectToGame = (playerName: string) => {
  socket.auth = { playerName };
  socket.connect();
};

export const emitTaskComplete = (playerId: string, taskId: string) => {
  socket.emit('completeTask', { playerId, taskId });
};

export const emitAccusePlayer = (accuserId: string, accusedId: string) => {
  socket.emit('accusePlayer', { accuserId, accusedId });
};

export const disconnectFromGame = () => {
  socket.disconnect();
};

export default socket;