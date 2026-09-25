export default function ManageLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--surface)]" />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-3 w-24 animate-pulse bg-[var(--border)]" />
        <div className="mt-4 h-10 w-48 animate-pulse bg-[var(--border)]" />
        <div className="mt-12 h-16 animate-pulse border-y border-[var(--border)]" />
      </main>
    </div>
  );
}
