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
        <Link
          href="/"
          prefetch={false}
          aria-label="HogeDD ホーム"
          className="flex min-w-0 items-center gap-2"
        >
          <Image
            src="/HogeDD.png"
            width={720}
            height={1030}
            alt=""
            className="h-10 w-auto shrink-0 sm:h-12"
            sizes="(max-width: 639px) 28px, 34px"
            preload
          />
          <span className="truncate text-lg font-semibold leading-7 text-[var(--foreground)] sm:text-xl sm:leading-8">
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
              prefetch={item.href === "/mypage" ? null : false}
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
