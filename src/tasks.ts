import { Task } from './types';

const taskList = [
  "Do the robot dance for 10 seconds",
  "Pretend to take a selfie with an invisible phone",
  "Dramatically gasp and look shocked at your phone",
  "Tie your shoe three times in a row",
  "Stretch and yawn extremely dramatically",
  "Walk in slow motion for 5 steps",
  "Pretend to conduct an orchestra briefly",
  "Do a fake sneeze that gets progressively louder",
  "Pretend to be on a catwalk for 3 steps",
  "Start humming and gradually get louder",
  "Pretend to be stuck in an invisible box",
  "Do the 'looking for my phone while it's in my hand' act",
  "Pretend to trip but catch yourself",
  "Wave enthusiastically at nobody",
  "Start a fake phone conversation about pineapples",
  "Draw an invisible picture in the air",
  "Pretend to be a statue for 10 seconds",
  "Do an invisible jump rope",
  "Act like you're walking against strong wind",
  "Pretend to juggle invisible balls",
];

// Keep track of assigned tasks globally
let assignedTasks = new Set<string>();

export const generateTasks = (): Task[] => {
  // Reset assigned tasks if we're running low on available tasks
  if (assignedTasks.size > taskList.length - 3) {
    assignedTasks.clear();
  }

  // Filter out already assigned tasks
  const availableTasks = taskList.filter(task => !assignedTasks.has(task));
  
  // Shuffle available tasks
  const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
  
  // Take first 3 tasks and mark them as assigned
  const selectedTasks = shuffled.slice(0, 3);
  selectedTasks.forEach(task => assignedTasks.add(task));

  // Convert to Task objects
  return selectedTasks.map(description => ({
    id: crypto.randomUUID(),
    description,
    completed: false,
  }));
};

// Function to release tasks when a player leaves
export const releaseTasks = (tasks: Task[]) => {
  tasks.forEach(task => assignedTasks.delete(task.description));
};