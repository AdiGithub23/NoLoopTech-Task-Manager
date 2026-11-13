import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type TaskStatus } from "@/types/task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  IN_PROGRESS:
    "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  DONE: "border-transparent bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}