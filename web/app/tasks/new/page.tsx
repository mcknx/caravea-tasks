import { TaskForm } from "@/app/task-form";

export default function NewTask() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">New task</h1>
      <TaskForm />
    </main>
  );
}
