"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  title: string;
  subtitle: string;
  navItems: readonly NavItem[];
  actions?: ReactNode;
};

export function SiteHeader({ title, subtitle, navItems, actions }: SiteHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      setIsVisible(currentScrollY < 80 || !isScrollingDown);
      lastScrollYRef.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(245,247,245,0.86)] backdrop-blur-sm transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--accent)] text-sm font-semibold text-white">
            H
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {title}
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)]">{subtitle}</span>
          </span>
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
