import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TaskForm } from "@/app/task-form";
import { getTask } from "@/lib/api";

async function EditForm({ params }: { params: PageProps<"/tasks/[id]/edit">["params"] }) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();
  return <TaskForm task={task} />;
}

export default function EditTask({ params }: PageProps<"/tasks/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Edit task</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <EditForm params={params} />
      </Suspense>
    </main>
  );
}
