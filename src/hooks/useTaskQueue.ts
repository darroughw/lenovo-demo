import { useCallback, useReducer } from "react";
import type { Task, TaskStatus } from "@/src/types/agent";

type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_STATUS"; taskId: string; taskStatus: TaskStatus }
  | { type: "REMOVE_TASK"; taskId: string }
  | { type: "CLEAR_COMPLETED" };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.task];
    case "UPDATE_STATUS":
      return state.map((task) =>
        task.id === action.taskId
          ? { ...task, taskStatus: action.taskStatus }
          : task
      );
    case "REMOVE_TASK":
      return state.filter((task) => task.id !== action.taskId);
    case "CLEAR_COMPLETED":
      return state.filter((task) => task.taskStatus.status !== "completed");
  }
}

export function useTaskQueue(initialTasks: Task[] = []) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  const addTask = useCallback((task: Task) => {
    dispatch({ type: "ADD_TASK", task });
  }, []);

  const updateStatus = useCallback(
    (taskId: string, taskStatus: TaskStatus) => {
      dispatch({ type: "UPDATE_STATUS", taskId, taskStatus });
    },
    []
  );

  const removeTask = useCallback((taskId: string) => {
    dispatch({ type: "REMOVE_TASK", taskId });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  return { tasks, addTask, updateStatus, removeTask, clearCompleted };
}
