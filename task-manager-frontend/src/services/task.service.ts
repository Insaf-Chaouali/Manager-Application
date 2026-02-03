import api from "./api";

/* ========= DTOs ========= */

export interface CreateTaskDTO {
  title: string;
  description?: string;
  date: string; // "yyyy-MM-dd"
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  date?: string; // "yyyy-MM-dd"
  // do not include isActive here — use toggle endpoint
}

/* ========= ENTITY ========= */

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  date: string; // "yyyy-MM-dd" or ISO string
  status: "pending" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  deadline?: string | null;
}

/* ========= SERVICE ========= */

export class TaskService {
  static async getAll(): Promise<Task[]> {
    const res = await api.get<Task[]>("/tasks");
    return res.data;
  }

  static async getOne(id: number): Promise<Task> {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  }

  static async create(dto: CreateTaskDTO): Promise<Task> {
    const res = await api.post<Task>("/tasks", dto);
    return res.data;
  }

  static async update(id: number, dto: UpdateTaskDTO): Promise<Task> {
    const res = await api.put<Task>(`/tasks/${id}`, dto);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  static async archive(id: number): Promise<Task> {
    const res = await api.patch<Task>(`/tasks/${id}/archive`);
    return res.data;
  }

  // backend endpoint toggles isActive server-side; no body required
  static async toggleActiveStatus(id: number): Promise<Task> {
    const res = await api.patch<Task>(`/tasks/${id}/toggle`);
    return res.data;
  }
}
