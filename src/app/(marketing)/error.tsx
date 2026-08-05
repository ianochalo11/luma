"use client";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-[960px] flex-col items-start justify-center gap-4 px-4 py-16">
      <h1 className="font-title text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand-50 hover:bg-brand-60 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
