"use client";

import { TaskTable } from "@/components/tasks/task-table";
import { TaskTableSkeleton } from "@/components/tasks/task-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";

export default function HomePage() {
  const { tasks, isLoading, error, retry } = useTasks();

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
          <p className="text-sm text-muted-foreground">
            Tasks you create will appear here.
          </p>
        </div>
      );
    }

    return <TaskTable tasks={tasks} />;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Task Manager</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of what needs to be done.
        </p>
      </div>
      {renderContent()}
    </main>
  );
}



