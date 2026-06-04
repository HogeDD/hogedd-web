export function HeroImpulsePanel() {
  return (
    <div aria-hidden="true" className="absolute -inset-7 overflow-hidden bg-[var(--highlight)]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,80,62,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(20,80,62,0.1)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <div className="absolute -right-24 top-[12%] h-72 w-72 rounded-full bg-[var(--foreground)]" />
      <div className="absolute -left-20 bottom-[8%] h-56 w-56 rounded-full border border-[var(--foreground)]/24" />
      <div className="absolute left-[22%] top-[34%] h-24 w-24 rounded-full bg-white/78" />
      <div className="absolute bottom-[20%] right-[28%] h-16 w-16 rounded-full border border-white/60" />

      <div className="absolute left-[14%] top-[15%] h-0 w-0 border-b-[120px] border-l-[70px] border-r-[70px] border-b-[var(--foreground)] border-l-transparent border-r-transparent" />
      <div className="absolute bottom-[16%] left-[30%] h-0 w-0 rotate-[18deg] border-b-[150px] border-l-[92px] border-r-[92px] border-b-[var(--accent)] border-l-transparent border-r-transparent" />
      <div className="absolute right-[8%] top-[35%] h-0 w-0 rotate-[61deg] border-b-[96px] border-l-[58px] border-r-[58px] border-b-white/86 border-l-transparent border-r-transparent" />
      <div className="absolute bottom-[34%] right-[43%] h-0 w-0 -rotate-[24deg] border-b-[64px] border-l-[38px] border-r-[38px] border-b-[var(--foreground)]/70 border-l-transparent border-r-transparent" />

      <div className="absolute left-[9%] top-[12%] flex gap-2">
        <span className="h-3 w-3 rounded-full bg-[var(--foreground)]" />
        <span className="h-3 w-3 rounded-full bg-[var(--foreground)]/55" />
      </div>
    </div>
  );
}
