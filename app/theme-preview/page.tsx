import { notFound } from "next/navigation";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { appThemePresets, getAppThemeStyle, type AppTheme } from "@/app/apps/_lib/app-theme";

export default function ThemePreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Development only
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">Theme Preview</h1>
        <p className="mt-6 max-w-2xl leading-7 text-[var(--muted)]">
          app themeの色面、白文字、通常背景上のラベル、ボタン、soft背景を同じ条件で比較する。
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {(Object.entries(appThemePresets) as [string, AppTheme][]).map(([name, theme]) => (
            <ThemeSample key={name} name={name} theme={theme} />
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SiteFooter />
      </div>
    </main>
  );
}

function ThemeSample({ name, theme }: { name: string; theme: AppTheme }) {
  return (
    <article
      className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-sm"
      style={getAppThemeStyle(theme)}
    >
      <header className="relative overflow-hidden bg-[var(--accent)] px-6 py-12 text-[var(--accent-foreground)] sm:px-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/20"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-80">Theme</p>
        <h2 className="mt-4 text-5xl font-semibold tracking-tight">{name}</h2>
      </header>

      <div className="bg-[var(--background)] px-6 py-8 text-[var(--foreground)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)]">
          Accent label
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">白文字が映える色面</h3>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          本文と補助文字は淡い背景上で読みやすさを保つ。accentはブランド色として明るく使う。
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <span className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)]">
            Primary
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold">
            Secondary
          </span>
        </div>

        <div className="mt-7 bg-[var(--surface-strong)] p-5">
          <p className="font-semibold">Surface strong</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            セクション背景とaccent softの組み合わせも確認する。
          </p>
          <div className="mt-4 h-3 rounded-full bg-[var(--accent-soft)]">
            <div className="h-3 w-2/3 rounded-full bg-[var(--highlight)]" />
          </div>
        </div>
      </div>
    </article>
  );
}
