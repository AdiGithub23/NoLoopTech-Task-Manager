"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskTableSkeleton } from "@/components/tasks/task-table-skeleton";
import {
  TasksToolbar,
  type SortOrder,
  type StatusFilter,
} from "@/components/tasks/tasks-toolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskInput } from "@/types/task";

export default function HomePage() {
  const { tasks, isLoading, error, retry, createTask, updateTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("NEWEST");

  const visibleTasks = tasks
    .filter((task) => statusFilter === "ALL" || task.status === statusFilter)
    .sort((a, b) => {
      if (sortOrder === "NEWEST") return 0;
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      const diff = a.dueDate.localeCompare(b.dueDate);
      return sortOrder === "DUE_ASC" ? diff : -diff;
    });

  const openCreateDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSubmit = (input: TaskInput) =>
    editingTask ? updateTask(editingTask.id, input) : createTask(input);

  const renderContent = () => {
    if (isLoading) {
      return <TaskTableSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Could not load tasks</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-foreground"
              onClick={retry}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="rounded-md border border-dashed py-16 text-center">
          <p className="font-medium">No tasks yet</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first task to get started.
          </p>
          <Button onClick={openCreateDialog}>
            <Plus />
            New task
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <TasksToolbar
          statusFilter={statusFilter}
          sortOrder={sortOrder}
          onStatusFilterChange={setStatusFilter}
          onSortOrderChange={setSortOrder}
        />
        {visibleTasks.length === 0 ? (
          <div className="rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground">
            No tasks match this filter.
          </div>
        ) : (
          <TaskTable
            tasks={visibleTasks}
            onEdit={openEditDialog}
            onDelete={setTaskToDelete}
          />
        )}
      </div>
    );
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Task Manager</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of what needs to be done.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus />
          New task
        </Button>
      </div>

      {renderContent()}

      <TaskFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSubmit={handleSubmit}
      />

      <DeleteTaskDialog
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={(task) => deleteTask(task.id)}
      />
    </main>
  );
}
