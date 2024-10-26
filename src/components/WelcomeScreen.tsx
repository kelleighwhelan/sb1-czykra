import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import useStore from '../store';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const addPlayer = useStore((state) => state.addPlayer);
  const startGame = useStore((state) => state.startGame);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPlayer(name.trim());
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Wand2 className="h-16 w-16 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Gotcha!</h1>
          <p className="text-gray-600 mb-8">
            Here's the deal: You'll get 3 silly tasks to complete in front of others... BUT DON'T GET
            CAUGHT! Think you see someone acting suspicious? Call them out! But guess wrong, and you'll
            lose points. Ready to be sneaky? 😈
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Sneaky Codename
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Enter your name..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transform transition hover:scale-105"
          >
            Let's Play! 🎮
          </button>
        </form>
      </div>
    </div>
  );
}