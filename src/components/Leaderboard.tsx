import React from 'react';
import { Trophy } from 'lucide-react';
import useStore from '../store';

export default function Leaderboard() {
  const players = useStore((state) => state.players);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      
      <div className="space-y-3">
        {[...players]
          .sort((a, b) => b.points - a.points)
          .map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">
                  #{index + 1}
                </span>
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="font-bold text-purple-500">{player.points}</span>
            </div>
          ))}
      </div>
    </div>
  );
}