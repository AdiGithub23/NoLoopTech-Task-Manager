"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { tasksApi } from "@/lib/api";
import type { Task, TaskInput } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await tasksApi.list());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    void loadTasks();
  };

  const createTask = async (input: TaskInput) => {
    const task = await tasksApi.create(input);
    setTasks((current) => [task, ...current]);
    toast.success("Task created");
  };

  const updateTask = async (id: string, input: TaskInput) => {
    const updated = await tasksApi.update(id, input);
    setTasks((current) => current.map((t) => (t.id === id ? updated : t)));
    toast.success("Task updated");
  };

  const deleteTask = async (id: string) => {
    await tasksApi.remove(id);
    setTasks((current) => current.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };

  return { tasks, isLoading, error, retry, createTask, updateTask, deleteTask };
}

