export interface Player {
  id: string;
  name: string;
  points: number;
  tasks: Task[];
  isReady: boolean;
  lastActive: number;
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: number;
}

export interface GameState {
  players: Player[];
  currentPlayerId: string | null;
  isGameStarted: boolean;
  timeRemaining: number;
  gameStatus: 'waiting' | 'playing' | 'ended';
  error: string | null;
  updateTimeRemaining: () => void;
  addPlayer: (name: string) => void;
  completeTask: (playerId: string, taskId: string) => Promise<void>;
  accusePlayer: (accuserId: string, accusedId: string) => Promise<void>;
  startGame: () => void;
  endGame: () => void;
  refreshTasks: (playerId: string) => void;
  setError: (error: string | null) => void;
  removeInactivePlayers: () => void;
}