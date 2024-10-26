import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import useStore from '../store';

interface AccusationPanelProps {
  currentPlayerId: string;
}

export default function AccusationPanel({ currentPlayerId }: AccusationPanelProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const { players, accusePlayer } = useStore();

  const handleAccuse = async () => {
    if (selectedPlayer && window.confirm('Are you sure you want to accuse this player?')) {
      await accusePlayer(currentPlayerId, selectedPlayer);
      setSelectedPlayer('');
    }
  };

  const otherPlayers = players.filter(p => p.id !== currentPlayerId);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-bold">Catch Someone!</h2>
      </div>

      <div className="space-y-4">
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select a player...</option>
          {otherPlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAccuse}
          disabled={!selectedPlayer}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
        >
          Accuse Player!
        </button>
      </div>
    </div>
  );
}