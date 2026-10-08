import Link from "next/link";
import { Suspense } from "react";
import { DeleteButton } from "@/app/delete-button";
import { getTasks, STATUSES } from "@/lib/api";

const badge: Record<string, string> = {
  todo: "bg-zinc-100 text-zinc-700",
  doing: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
  high: "text-red-600",
  medium: "text-zinc-600",
  low: "text-zinc-400",
};

async function TaskList({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const { status } = await searchParams;
  const current = typeof status === "string" && (STATUSES as readonly string[]).includes(status) ? status : undefined;
  const tasks = await getTasks(current);

  return (
    <>
      <nav className="mb-4 flex gap-2 text-sm">
        {[undefined, ...STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/?status=${s}` : "/"}
            className={`rounded-full px-3 py-1 ${s === current ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
          >
            {s ?? "all"}
          </Link>
        ))}
      </nav>
      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">No tasks here yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className={`font-medium ${t.status === "done" ? "text-zinc-400 line-through" : ""}`}>{t.title}</p>
                {t.notes && <p className="mt-1 truncate text-sm text-zinc-500">{t.notes}</p>}
                <p className="mt-2 flex items-center gap-3 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${badge[t.status]}`}>{t.status}</span>
                  <span className={badge[t.priority]}>{t.priority} priority</span>
                  {t.due_date && <span className="text-zinc-500">due {t.due_date}</span>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link href={`/tasks/${t.id}/edit`} className="text-sm text-zinc-700 hover:underline">Edit</Link>
                <DeleteButton id={t.id} title={t.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Link href="/tasks/new" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">New task</Link>
      </header>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading tasks…</p>}>
        <TaskList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
