export type ReferenceLink = {
  label: string;
  href: string;
  description?: string;
};

export function AppAboutShell({
  appName,
  ddLabel,
  paragraphs,
  youtubeUrl,
  youtubeThumbnailUrl,
  referenceLinks,
}: {
  appName: string;
  ddLabel: string;
  paragraphs: readonly string[];
  youtubeUrl?: string;
  youtubeThumbnailUrl?: string;
  referenceLinks?: readonly ReferenceLink[];
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
            {ddLabel}
          </p>
          <h1 className="text-6xl font-semibold tracking-tight sm:text-7xl">{appName}</h1>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[var(--accent-soft)]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-10 bottom-10 h-36 w-36 rounded-full bg-[var(--accent-soft)]/50"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="mb-10 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Why
          </p>
          <div className="space-y-6">
            {paragraphs.map((text, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-xl font-medium leading-[1.8]"
                    : "text-base leading-[1.9] text-[var(--foreground)]/75"
                }
              >
                {text}
              </p>
            ))}
          </div>
          <div className="mt-14 flex items-center gap-2" aria-hidden="true">
            <span className="h-2 w-10 bg-[var(--highlight)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--foreground)]/25" />
          </div>
        </div>
      </section>

      {youtubeUrl && youtubeThumbnailUrl && (
        <section className="bg-[var(--surface-strong)]">
          <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              YouTube
            </p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[18px] shadow-[0_6px_18px_rgba(20,24,22,0.10)] transition duration-300 hover:shadow-[0_20px_40px_rgba(20,24,22,0.20)] motion-safe:hover:-translate-y-1"
            >
              <div
                className="aspect-video w-full bg-cover bg-center transition duration-500 motion-safe:group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${youtubeThumbnailUrl})` }}
                aria-label={`${appName} の YouTube 動画サムネイル`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition duration-300 motion-safe:group-hover:scale-110 group-hover:bg-[var(--highlight)]">
                  <svg
                    className="ml-1 h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                <p className="text-sm font-semibold text-white/80 transition group-hover:text-white">
                  {appName} — YouTube で見る ↗
                </p>
              </div>
            </a>
          </div>
        </section>
      )}

      {referenceLinks && referenceLinks.length > 0 && (
        <section className="relative overflow-hidden">
          <div
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-[var(--highlight)]/20"
            aria-hidden="true"
          />
          <div
            className="absolute left-6 top-8 h-16 w-16 rounded-full bg-[var(--highlight)]/15"
            aria-hidden="true"
          />
          <div className="relative mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              参考にしたもの
            </p>
            <ul className="space-y-8">
              {referenceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)] underline underline-offset-4 group-hover:text-[var(--accent)]">
                      {link.label}
                    </p>
                    {link.description && (
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {link.description}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
