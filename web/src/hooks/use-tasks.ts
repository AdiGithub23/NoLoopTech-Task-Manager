"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tasksApi } from "@/lib/api";
import type { Task, TaskInput } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    tasksApi
      .list()
      .then((data) => {
        if (ignore) return;
        setTasks(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Failed to load tasks.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
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


