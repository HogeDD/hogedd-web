import Link from "next/link";
import { youtubeChannelUrl } from "@/app/_lib/site-navigation";

const xShareUrl = "https://x.com/intent/tweet?text=HogeDD&url=https%3A%2F%2Fwww.hogedd.com%2F";

export function SiteFooter() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2 border-t border-black/10 bg-[var(--background)] px-4 py-10 text-[var(--foreground)] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <Link href="/" className="group w-fit" aria-label="HogeDD ホーム">
          <span>
            <span className="block text-2xl font-semibold tracking-tight">HogeDD</span>
            <span className="mt-1 block text-sm text-[var(--muted)]">Hoge Driven Development</span>
          </span>
        </Link>

        <nav aria-label="フッターナビゲーション">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            <li>
              <FooterLink href="/apps" label="Apps" />
            </li>
            <li>
              <FooterLink href="/#about" label="About" />
            </li>
            <li>
              <FooterLink href={youtubeChannelUrl} label="YouTube" external />
            </li>
            <li>
              <FooterLink href={xShareUrl} label="Xで共有" external />
            </li>
          </ul>
        </nav>

        <p className="text-xs text-[var(--muted)] sm:col-span-2">© HogeDD</p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-sm font-semibold transition hover:text-[var(--accent)]"
    >
      {label}
    </Link>
  );
}
