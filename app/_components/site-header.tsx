"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNavigation } from "@/app/_lib/site-navigation";

export function SiteHeader() {
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      setIsMobileVisible(currentScrollY > 48 && isScrollingUp);
      lastScrollYRef.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 border-b border-[var(--border)] bg-[rgba(245,247,245,0.92)] backdrop-blur-md transition-transform duration-300 ease-out sm:sticky sm:translate-y-0",
        isMobileVisible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:h-18 sm:px-6 lg:px-8">
        <Link href="/" aria-label="HogeDD ホーム" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/HogeDDLogo.png"
            width={1096}
            height={1098}
            alt=""
            className="h-9 w-9 shrink-0 rounded-[10px] sm:h-11 sm:w-11 sm:rounded-[13px]"
            sizes="(max-width: 639px) 36px, 44px"
            preload
          />
          <span className="truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">
            HogeDD
          </span>
        </Link>

        <nav
          aria-label="主要ナビゲーション"
          className="flex shrink-0 items-center gap-0.5 sm:gap-1"
        >
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="px-2 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] sm:rounded-full sm:px-3 sm:text-sm sm:hover:bg-[var(--surface)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
