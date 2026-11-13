import type { Task, TaskInput } from "@/types/task";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Sends the request and turns every failure into an ApiError with a readable message.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Please check that the API is running.",
      0,
    );
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await response.json();
      message = Array.isArray(body.message)
        ? body.message.join(", ")
        : (body.message ?? message);
    } catch {
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const tasksApi = {
  list: () => request<Task[]>("/tasks"),

  create: (input: TaskInput) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(input) }),

  update: (id: string, input: TaskInput) =>
    request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};