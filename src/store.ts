import { create } from 'zustand';
import { GameState, Player, Task } from './types';
import { generateTasks, releaseTasks } from './tasks';
import toast from 'react-hot-toast';
import { connectToGame, emitTaskComplete, emitAccusePlayer, disconnectFromGame } from './services/socket';

const INACTIVE_TIMEOUT = 30000; // 30 seconds

const getEndTime = () => {
  const today = new Date();
  today.setHours(20, 0, 0, 0); // 8:00 PM
  return today.getTime();
};

const calculateTimeRemaining = () => {
  const now = new Date().getTime();
  const end = getEndTime();
  return Math.max(0, Math.floor((end - now) / 1000));
};

const useStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayerId: null,
  isGameStarted: false,
  timeRemaining: calculateTimeRemaining(),
  gameStatus: 'waiting',
  error: null,

  updateTimeRemaining: () => {
    const remaining = calculateTimeRemaining();
    set({ timeRemaining: remaining });
    
    if (remaining <= 0 && get().gameStatus === 'playing') {
      get().endGame();
    }
  },

  addPlayer: (name) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      points: 0,
      tasks: generateTasks(),
      isReady: true,
      lastActive: Date.now(),
    };

    set((state) => ({
      players: [...state.players, newPlayer],
      currentPlayerId: state.currentPlayerId || newPlayer.id,
    }));
    
    connectToGame(name);
    toast.success(`Welcome to the game, ${name}!`);
  },

  completeTask: async (playerId, taskId) => {
    try {
      emitTaskComplete(playerId, taskId);
      
      set((state) => ({
        players: state.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                points: player.points + 1,
                tasks: player.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, completed: true, completedAt: Date.now() }
                    : task
                ),
                lastActive: Date.now(),
              }
            : player
        ),
      }));

      toast.success('Task completed! +1 point');

      // Check if all tasks are completed
      const player = get().players.find((p) => p.id === playerId);
      if (player && player.tasks.every((t) => t.completed)) {
        // Release completed tasks before generating new ones
        releaseTasks(player.tasks);
        get().refreshTasks(playerId);
      }
    } catch (error) {
      toast.error('Failed to complete task');
      set({ error: 'Failed to complete task' });
    }
  },

  accusePlayer: async (accuserId, accusedId) => {
    try {
      emitAccusePlayer(accuserId, accusedId);
      
      const accusedPlayer = get().players.find((p) => p.id === accusedId);
      if (!accusedPlayer) throw new Error('Player not found');

      const recentlyCompletedTask = accusedPlayer.tasks.find(
        (t) => t.completedAt && Date.now() - t.completedAt < 10000
      );

      set((state) => ({
        players: state.players.map((player) => {
          if (player.id === accuserId) {
            return {
              ...player,
              points: player.points + (recentlyCompletedTask ? 1 : -1),
              lastActive: Date.now(),
            };
          }
          if (player.id === accusedId && recentlyCompletedTask) {
            return {
              ...player,
              points: player.points - 1,
              lastActive: Date.now(),
            };
          }
          return player;
        }),
      }));
    } catch (error) {
      toast.error('Failed to make accusation');
      set({ error: 'Failed to make accusation' });
    }
  },

  startGame: () => {
    set({ isGameStarted: true, gameStatus: 'playing', error: null });
    toast.success('Game started!');
  },

  endGame: () => {
    set({ gameStatus: 'ended' });
    const winner = [...get().players].sort((a, b) => b.points - a.points)[0];
    toast.success(`Game Over! ${winner.name} wins with ${winner.points} points!`);
    disconnectFromGame();
  },

  refreshTasks: (playerId) => {
    set((state) => {
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        // Release old tasks before generating new ones
        releaseTasks(player.tasks);
      }
      return {
        players: state.players.map((player) =>
          player.id === playerId
            ? { ...player, tasks: generateTasks() }
            : player
        ),
      };
    });
    toast.success('New tasks assigned!');
  },

  setError: (error) => set({ error }),

  removeInactivePlayers: () => {
    const now = Date.now();
    set((state) => {
      const playersToRemove = state.players.filter(
        (player) => now - player.lastActive >= INACTIVE_TIMEOUT
      );
      
      // Release tasks from removed players
      playersToRemove.forEach(player => releaseTasks(player.tasks));
      
      return {
        players: state.players.filter(
          (player) => now - player.lastActive < INACTIVE_TIMEOUT
        ),
      };
    });
  },
}));

export default useStore;