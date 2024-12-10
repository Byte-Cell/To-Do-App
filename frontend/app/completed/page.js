"use client"

import { useCompletedTasks } from "../context/CompletedTasksContext";
import { useDarkMode } from '../context/DarkModeContext';
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';

export default function CompletedPage() {
  const { completedTasks } = useCompletedTasks();
  const { darkMode } = useDarkMode();

  return (
    <div className={`h-screen bg-gray-100 p-4 overflow-y-auto scrollbar-none ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="flex flex-row items-center">
        <Link 
          href="/"
          className="py-2 hover:bg-gray-100 dark:hover:bg-inherit flex flex-row items-center"
        >
          <FaArrowLeftLong className="text-purple-600 hover:text-purple-700 text-lg" />
          <p className="ml-2 font-medium hover:text-purple-700">Return</p>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold my-10 text-center">Completed Tasks ✅</h1>

      {completedTasks.length === 0 ? (
        <p className="text-center">No tasks have been completed yet.</p>
      ) : (
        <ul>
          {completedTasks.map(task => (
            <li 
              key={task._id} 
              className="bg-white text-black p-4 my-4 rounded-lg font-medium"
            >
              {task.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
