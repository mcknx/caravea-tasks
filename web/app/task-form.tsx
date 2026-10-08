"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveTask, type FormState } from "@/app/actions";
import { PRIORITIES, STATUSES, type Task } from "@/lib/api";

const field = "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

export function TaskForm({ task }: { task?: Task }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveTask.bind(null, task?.id ?? null), {});
  // After a failed save, show what the user typed, not the stored values.
  const v = state.values ?? {
    title: task?.title ?? "",
    notes: task?.notes ?? "",
    due_date: task?.due_date ?? "",
    status: task?.status ?? "todo",
    priority: task?.priority ?? "medium",
  };
  const error = (name: string) =>
    state.errors?.[name] && <p className="mt-1 text-sm text-red-600">{state.errors[name][0]}</p>;

  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium">
        Title
        <input name="title" defaultValue={v.title} className={field} />
        {error("title")}
      </label>
      <label className="block text-sm font-medium">
        Notes
        <textarea name="notes" defaultValue={v.notes} rows={3} className={field} />
        {error("notes")}
      </label>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-sm font-medium">
          Due date
          <input type="date" name="due_date" defaultValue={v.due_date} className={field} />
          {error("due_date")}
        </label>
        <label className="block text-sm font-medium">
          Status
          <select name="status" defaultValue={v.status} className={field}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {error("status")}
        </label>
        <label className="block text-sm font-medium">
          Priority
          <select name="priority" defaultValue={v.priority} className={field}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          {error("priority")}
        </label>
      </div>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {pending ? "Saving…" : task ? "Save changes" : "Create task"}
        </button>
        <Link href="/" className="rounded-md px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900">Cancel</Link>
      </div>
    </form>
  );
}
