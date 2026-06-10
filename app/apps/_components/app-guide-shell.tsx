type NonEmptyStringList = readonly [string, ...string[]];

export function AppGuideShell({
  appName,
  firstSteps,
  basicControls,
  screenGuide,
  rules,
  tips,
}: {
  appName: string;
  firstSteps: NonEmptyStringList;
  basicControls: NonEmptyStringList;
  screenGuide: NonEmptyStringList;
  rules: NonEmptyStringList;
  tips: NonEmptyStringList;
}) {
  return (
    <main>
      <header className="relative overflow-hidden bg-[var(--accent)] text-white">
        <div
          className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 right-24 h-48 w-48 rounded-full border border-[var(--highlight)]/30"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-0 h-px w-80 -translate-x-1/2 bg-white/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--highlight)]">
            Guide
          </p>
          <h1 className="text-6xl font-semibold tracking-tight sm:text-7xl">{appName}</h1>
        </div>
      </header>

      <GuideSection label="最初に行う操作" items={firstSteps} ordered />
      <GuideSection label="基本操作" items={basicControls} tone="strong" />
      <GuideSection label="画面の見方" items={screenGuide} size="large" />
      <GuideSection label="ルール" items={rules} tone="strong" />
      <GuideSection label="困ったときは" items={tips} />
    </main>
  );
}

function GuideSection({
  label,
  items,
  ordered = false,
  tone = "default",
  size = "default",
}: {
  label: string;
  items: NonEmptyStringList;
  ordered?: boolean;
  tone?: "default" | "strong";
  size?: "default" | "large";
}) {
  const itemTextClassName =
    size === "large"
      ? "text-lg leading-7 text-[var(--foreground)]"
      : "text-base leading-7 text-[var(--foreground)]";

  return (
    <section className={tone === "strong" ? "bg-[var(--surface-strong)]" : undefined}>
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          {label}
        </p>

        {ordered ? (
          <ol className="space-y-4">
            {items.map((text, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className={`pt-0.5 ${itemTextClassName}`}>{text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="space-y-4">
            {items.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--highlight)]"
                  aria-hidden="true"
                />
                <p className={itemTextClassName}>{text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
