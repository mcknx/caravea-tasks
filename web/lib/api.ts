// Server-only helpers for talking to the Laravel API.
export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000/api";

export const STATUSES = ["todo", "doing", "done"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;

export type Task = {
  id: number;
  title: string;
  notes: string | null;
  due_date: string | null;
  status: (typeof STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
  created_at: string;
  updated_at: string;
};

export function api(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    // Accept: JSON makes Laravel answer errors (422, 404) as JSON, not HTML.
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init.headers },
  });
}

export async function getTasks(status?: string): Promise<Task[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await api(`/tasks${query}`);
  if (!res.ok) throw new Error(`Could not load tasks (HTTP ${res.status})`);
  return (await res.json()).data;
}

export async function getTask(id: string): Promise<Task | null> {
  const res = await api(`/tasks/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not load task (HTTP ${res.status})`);
  return (await res.json()).data;
}
