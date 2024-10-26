import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import useStore from '../store';

export default function Timer() {
  const { timeRemaining, updateTimeRemaining } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateTimeRemaining]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Game Over!";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-6 w-6 text-gray-600" />
      <span className="text-xl font-semibold">{formatTime(timeRemaining)}</span>
    </div>
  );
}