import React from 'react';
import { Trophy } from 'lucide-react';
import useStore from '../store';

export default function GameOver() {
  const players = useStore((state) => state.players);
  const winner = [...players].sort((a, b) => b.points - a.points)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Over!</h1>
        <div className="mb-8">
          <p className="text-2xl font-semibold text-purple-600 mb-2">
            {winner.name} Wins!
          </p>
          <p className="text-gray-600">with {winner.points} points</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Final Scores</h2>
          {[...players]
            .sort((a, b) => b.points - a.points)
            .map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="font-semibold">
                  #{index + 1} {player.name}
                </span>
                <span className="font-bold text-purple-500">{player.points} pts</span>
              </div>
            ))}
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}