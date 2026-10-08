"use client";

import { deleteTask } from "@/app/actions";

export function DeleteButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deleteTask.bind(null, id)}
      onSubmit={(e) => { if (!confirm(`Delete "${title}"?`)) e.preventDefault(); }}
    >
      <button className="text-sm text-red-600 hover:underline">Delete</button>
    </form>
  );
}
