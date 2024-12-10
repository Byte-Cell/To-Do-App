"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CompletedTasksContext = createContext();

export const CompletedTasksProvider = ({ children }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const storedCompletedTasks = JSON.parse(sessionStorage.getItem("completedTasks")) || [];
    const currentTime = new Date().getTime();
    const filteredCompletedTasks = storedCompletedTasks.filter(task => {
      const taskTime = new Date(task.completedAt).getTime();
      return currentTime - taskTime < 86400000;
    });
    setCompletedTasks(filteredCompletedTasks);

    return () => {
      setCompletedTasks([]);
      sessionStorage.removeItem("completedTasks");
    };
  }, []);

  useEffect(() => {
    if (completedTasks.length > 0) {
      sessionStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    } else {
      sessionStorage.removeItem("completedTasks");
    }
  }, [completedTasks]);

  return (
    <CompletedTasksContext.Provider value={{ completedTasks, setCompletedTasks }}>
      {children}
    </CompletedTasksContext.Provider>
  );
};

export const useCompletedTasks = () => {
  const context = useContext(CompletedTasksContext);

  if (!context) {
    throw new Error("useCompletedTasks must be used within a CompletedTasksProvider");
  }

  return context;
};
