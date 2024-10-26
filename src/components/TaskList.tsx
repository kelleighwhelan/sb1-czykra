import React from 'react';
import { RefreshCcw } from 'lucide-react';
import useStore from '../store';
import { Player } from '../types';
import clsx from 'clsx';

interface TaskListProps {
  player: Player;
}

export default function TaskList({ player }: TaskListProps) {
  const completeTask = useStore((state) => state.completeTask);
  const refreshTasks = useStore((state) => state.refreshTasks);

  const handleTaskComplete = async (taskId: string) => {
    if (window.confirm('Are you sure you completed this task?')) {
      await completeTask(player.id, taskId);
    }
  };

  const allTasksCompleted = player.tasks.every((t) => t.completed);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Secret Tasks</h2>
        {allTasksCompleted && (
          <button
            onClick={() => refreshTasks(player.id)}
            className="flex items-center space-x-2 text-purple-500 hover:text-purple-600"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>New Tasks</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {player.tasks.map((task) => (
          <div
            key={task.id}
            className={clsx(
              'p-4 rounded-lg border transition-all duration-200',
              task.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-purple-200'
            )}
          >
            <div className="flex items-center justify-between">
              <p className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.description}
              </p>
              {!task.completed && (
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  className="text-sm bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}