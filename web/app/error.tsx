"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
      <p className="mb-6 text-sm text-zinc-600">{error.message}. Is the Laravel API running on port 8000?</p>
      <button onClick={reset} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Try again</button>
    </main>
  );
}
