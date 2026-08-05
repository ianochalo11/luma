export default function BreakpointLoading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[380px_1fr]">
      <div className="bg-surface-muted aspect-square animate-pulse rounded-2xl" />
      <div className="space-y-4">
        <div className="bg-surface-muted h-8 w-48 animate-pulse rounded-full" />
        <div className="bg-surface-muted h-12 w-3/4 animate-pulse rounded-md" />
        <div className="bg-surface-muted h-40 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}
