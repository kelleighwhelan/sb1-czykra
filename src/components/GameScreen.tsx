import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import useStore from '../store';
import Timer from './Timer';
import { Toaster } from 'react-hot-toast';
import GameOver from './GameOver';
import TaskList from './TaskList';
import Leaderboard from './Leaderboard';
import AccusationPanel from './AccusationPanel';
import socket from '../services/socket';

export default function GameScreen() {
  const { 
    gameStatus,
    currentPlayerId,
    players,
    removeInactivePlayers
  } = useStore();

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  useEffect(() => {
    const cleanup = setInterval(removeInactivePlayers, 10000);
    return () => {
      clearInterval(cleanup);
      socket.disconnect();
    };
  }, [removeInactivePlayers]);

  if (!currentPlayer) return null;
  if (gameStatus === 'ended') return <GameOver />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-2xl font-bold">Your Score: {currentPlayer.points}</h1>
          </div>
          <Timer />
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TaskList player={currentPlayer} />
            <AccusationPanel currentPlayerId={currentPlayer.id} />
          </div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}