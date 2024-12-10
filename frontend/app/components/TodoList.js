"use client";

import { useState, useEffect, useMemo } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../../lib/api.js';
import { MdKeyboardArrowDown } from "react-icons/md";
import { LiaCheckSolid } from "react-icons/lia";
import { RxCross1 } from "react-icons/rx";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { useDarkMode } from "../context/DarkModeContext";
import Link from 'next/link';
import { useCompletedTasks } from "../context/CompletedTasksContext.js";
import { useDeletedTasks } from "../context/DeletedTasksContext.js";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newPriority, setNewPriority] = useState("medium");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const { deletedTasks, setDeletedTasks } = useDeletedTasks();
  const { completedTasks, setCompletedTasks } = useCompletedTasks();
  const { darkMode, setDarkMode } = useDarkMode();

  const getTodos = async () => {
    const todosFromServer = await fetchTodos(false);
    setTodos(todosFromServer);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTask.trim()) {
      const newTodo = await createTodo(newTask, newPriority);
      setTodos([...todos, newTodo]);
      setNewTask('');
      setNewPriority('medium');
    }
  };

  const handleToggleCompleted = async (id) => {
    const taskToComplete = todos.find(todo => todo._id === id);
    if (!taskToComplete) return;

    try {
      const updatedTodo = await updateTodo(id, taskToComplete.task, true);
      setCompletedTasks(prevState => {
        const updatedCompletedTasks = [...prevState, updatedTodo];
        sessionStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
        return updatedCompletedTasks;
      });
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    const taskToDelete = todos.find(todo => todo._id === id);
    try {
      await deleteTodo(id);
      setDeletedTasks([...deletedTasks, taskToDelete]);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDate = () => {
    const today = selectedDate || new Date();
    const options = { weekday: "short", day: "numeric", month: "long", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  const filterTasksByPriority = (priority) => {
    setPriorityFilter(priority);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredTasks = useMemo(() => {
    return priorityFilter
      ? todos.filter(todo => todo.priority === priorityFilter)
      : todos;
  }, [todos, priorityFilter]);

  return (
    <div className={`h-screen flex justify-center p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className="flex flex-col w-4/5">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <strong className="font-bold">Hello, there!</strong>
              <span className="ml-2 text-2xl">{"\u{1F44B}"}</span>
            </div>
            <p className="text-gray-400">{handleDate()}</p>
          </div>
          <div className="flex flex-row items-center mt-4 lg:mt-0 justify-between">
            <div className="mr-2">
              <button
                id="dropdownHoverButton"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 h-9 text-center inline-flex items-center"
                type="button"
              >
                <p>Tasks</p>
                <MdKeyboardArrowDown className="ml-2" />
              </button>
              <div
                id="dropdownHover"
                className={`absolute z-10 ${isDropdownOpen ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <ul className="py-2 text-sm text-black" aria-labelledby="dropdownHoverButton">
                  <li>
                    <Link href="/completed" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-purple-600 dark:hover:text-white flex flex-row items-center">
                      <LiaCheckSolid className="text-green-500" />
                      <p className="ml-2 font-medium">Completed</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/deleted" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-purple-600 dark:hover:text-white flex flex-row items-center">
                      <RxCross1 className="text-red-500" />
                      <p className="ml-2 font-medium">Deleted</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <button
                type="button"
                className="text-black bg-white font-medium rounded-lg text-sm px-5 py-2 h-9 text-center hover:bg-gray-100"
                onClick={toggleDarkMode}
              >
                {darkMode ? <IoMdSunny className="text-yellow-500" /> : <IoMdMoon className="text-yellow-500" />}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Create a new task..."
              className="w-full my-2 p-2 focus:ring-4 text-black focus:ring-purple-300 outline-none rounded-md"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="w-full my-2 p-2 focus:ring-4 text-black focus:ring-purple-300 outline-none rounded-md appearance-none"
            >
              <option value="" disabled>Select Priority</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button
              type="button"
              className="text-white bg-purple-700 hover:bg-purple-800 w-40 px-5 py-2 my-2 rounded-lg focus:ring-4 focus:ring-purple-300 font-medium"
              onClick={handleAddTodo}
            >
              Add Task
            </button>
          </div>
          <div className="w-full max-h-[450px] flex-grow overflow-y-auto scrollbar-none">
            <ul className="w-full">
              {filteredTasks.map((todo) => (
                <li
                  key={todo._id}
                  className={`w-full flex flex-col sm:flex-row justify-between items-center bg-white text-black p-4 my-4 rounded-lg transition-transform duration-300 hover:-translate-y-2 border-l-4 ${
                    todo.priority === "high"
                      ? "border-red-500"
                      : todo.priority === "medium"
                      ? "border-yellow-500"
                      : todo.priority === "low"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  <span
                    onClick={() => handleToggleCompleted(todo._id)}
                    className="font-bold mb-4 sm:mb-0 sm:mr-4 text-left w-full sm:w-auto"
                  >
                    {todo.task}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="text-white bg-green-700 hover:bg-green-800 w-30 px-5 py-2 rounded-lg focus:ring-4 focus:ring-green-300 font-medium"
                      onClick={() => handleToggleCompleted(todo._id)}
                    >
                      Complete
                    </button>
                    <button
                      className="text-white bg-red-700 hover:bg-red-800 w-30 px-5 py-2 rounded-lg focus:ring-4 focus:ring-red-300 font-medium"
                      onClick={() => handleDeleteTodo(todo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 hover:text-purple-300 text-center">
          <a href="https://www.flaticon.com/free-icons/calendar" title="calendar icons">
            Calendar icons created by pojok d - Flaticon
          </a>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
