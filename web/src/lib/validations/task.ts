import { z } from "zod";
import { TASK_STATUSES, type Task, type TaskInput } from "@/types/task";

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer"),
  status: z.enum(TASK_STATUSES),
  dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const emptyTaskForm: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  dueDate: "",
};

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  };
}

export function formValuesToInput(values: TaskFormValues): TaskInput {
  return {
    title: values.title.trim(),
    description: values.description.trim() === "" ? null : values.description,
    status: values.status,
    dueDate: values.dueDate === "" ? null : values.dueDate,
  };
}


