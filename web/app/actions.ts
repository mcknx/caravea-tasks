"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";

export type FormState = {
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
  message?: string;
};

// Creates a task (id null) or updates one, then goes back to the list.
// Laravel owns validation: a 422 comes back here and the form shows it per field.
export async function saveTask(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    due_date: String(formData.get("due_date") ?? ""),
    status: String(formData.get("status") ?? "todo"),
    priority: String(formData.get("priority") ?? "medium"),
  };

  const res = await api(id ? `/tasks/${id}` : "/tasks", {
    method: id ? "PATCH" : "POST",
    // Empty optional fields are sent as null so Laravel clears them.
    body: JSON.stringify({ ...values, notes: values.notes || null, due_date: values.due_date || null }),
  });

  if (res.status === 422) return { errors: (await res.json()).errors, values };
  if (!res.ok) return { message: `Could not save the task (HTTP ${res.status}).`, values };

  revalidatePath("/");
  redirect("/");
}

export async function deleteTask(id: number) {
  const res = await api(`/tasks/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`Could not delete the task (HTTP ${res.status})`);
  revalidatePath("/");
}
