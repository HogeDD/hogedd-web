"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/ui/carousel";
import type { AppLink } from "@/app/apps/_lib/app-links";

type HomeAppCarouselProps = {
  items: readonly AppLink[];
};

type AppSlide = {
  kind: "app";
  key: string;
  title: string;
  status: "published" | "preparing";
  appHref: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
};

type MockSlide = {
  kind: "mock";
  key: string;
  title: string;
  tag: string;
};

type Slide = AppSlide | MockSlide;

const mockSlides: readonly MockSlide[] = [
  {
    kind: "mock",
    key: "mock-next",
    title: "次の作品",
    tag: "Coming soon",
  },
  {
    kind: "mock",
    key: "mock-draft",
    title: "準備中の棚",
    tag: "Draft",
  },
];

export function HomeAppCarousel({ items }: HomeAppCarouselProps) {
  const slides = useMemo<readonly Slide[]>(() => {
    const appSlides: AppSlide[] = items.map((item) => ({
      kind: "app",
      key: item.slug,
      title: item.title,
      status: item.status,
      appHref: item.appHref,
      youtubeUrl: item.status === "published" ? item.youtubeUrl : undefined,
      thumbnailUrl: item.status === "published" ? item.thumbnailUrl : undefined,
    }));

    return [...appSlides, ...mockSlides];
  }, [items]);

  if (slides.length === 0) {
    return (
      <div className="mt-10 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        アプリがまだありません。
      </div>
    );
  }

  return (
    <Carousel opts={{ align: "start", loop: true }} className="mt-10">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.key} className="basis-[86%] sm:basis-[58%] lg:basis-1/3">
            <CarouselCard slide={slide} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-4 flex items-center justify-center gap-4">
        <CarouselPrevious className="text-white" />
        <span className="h-px w-10 bg-white/30" aria-hidden="true" />
        <CarouselNext className="text-white" />
      </div>
    </Carousel>
  );
}

function CarouselCard({ slide }: { slide: Slide }) {
  return (
    <article className="group h-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_28px_rgba(20,24,22,0.04)] transition hover:border-[var(--accent)]">
      <div className="flex h-full min-h-[17.5rem] w-full flex-col overflow-hidden sm:min-h-[18.5rem]">
        <div className="aspect-video flex-none overflow-hidden bg-[var(--surface-strong)]">
          {slide.kind === "app" ? (
            slide.status === "published" ? (
              <div
                className="h-full bg-cover bg-center"
                aria-label={`${slide.title} の YouTube サムネイル`}
                style={{ backgroundImage: `url(${slide.thumbnailUrl})` }}
              />
            ) : (
              <div className="flex h-full items-end bg-[linear-gradient(135deg,rgba(23,63,52,0.08),rgba(23,63,52,0.01))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  動画準備中
                </p>
              </div>
            )
          ) : (
            <div className="flex h-full items-end bg-[linear-gradient(135deg,rgba(23,63,52,0.06),rgba(23,63,52,0.01))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                {slide.tag}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <h3 className="text-xl font-semibold tracking-tight">{slide.title}</h3>

          <div className="mt-auto flex flex-wrap gap-3">
            {slide.kind === "app" ? (
              <>
                <Link
                  href={slide.appHref}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  アプリを見る
                </Link>
                {slide.status === "published" ? (
                  <a
                    href={slide.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                  >
                    YouTube
                  </a>
                ) : null}
              </>
            ) : (
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {slide.tag}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
