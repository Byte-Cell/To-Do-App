"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DeletedTasksContext = createContext();

export const DeletedTasksProvider = ({ children }) => {
  const [deletedTasks, setDeletedTasks] = useState([]);

  useEffect(() => {
    const storedDeletedTasks = JSON.parse(sessionStorage.getItem("deletedTasks")) || [];
    setDeletedTasks(storedDeletedTasks);

    return () => {
      setDeletedTasks([]);
      sessionStorage.removeItem("deletedTasks");
    };
  }, []);

  useEffect(() => {
    if (deletedTasks.length > 0) {
      sessionStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
    } else {
      sessionStorage.removeItem("deletedTasks");
    }
  }, [deletedTasks]);

  return (
    <DeletedTasksContext.Provider value={{ deletedTasks, setDeletedTasks }}>
      {children}
    </DeletedTasksContext.Provider>
  );
};

export const useDeletedTasks = () => useContext(DeletedTasksContext);
