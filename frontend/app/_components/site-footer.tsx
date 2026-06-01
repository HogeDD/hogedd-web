import Link from "next/link";
import type { ReactNode } from "react";

type FooterLink = {
  href: string;
  label: string;
};

type SiteFooterProps = {
  title: string;
  description: string;
  links: readonly FooterLink[];
  actions?: ReactNode;
};

export function SiteFooter({ title, description, links, actions }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--border)] pt-12">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            {title}
          </p>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav className="flex flex-wrap gap-2 sm:justify-end">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {actions ? <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div> : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>Made by HogeDD</p>
        <p>きっかけは、なんでもいい。</p>
      </div>
    </footer>
  );
}
