"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Photo, assetUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";

/**
 * The full-bleed portfolio band on a model's page.
 *
 * Every photo is drawn at one shared height and keeps its own natural width, so
 * a tight portrait and a wide editorial sit side by side at their true
 * proportions. Widths come from the stored dimensions rather than from
 * measuring the loaded image, which keeps the row from reflowing as photos
 * arrive. Clicking one opens it full-page.
 */
export default function ModelPortfolioStrip({
  photos,
  modelName,
}: {
  photos: Photo[];
  modelName: string;
}) {
  const { t } = useLanguage();
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [openAt, setOpenAt] = useState<number | null>(null);
  const isOpen = openAt !== null;

  const syncEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = scroller.current;
    if (!el) return;
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges, photos.length]);

  // Not a full page each time: leaving a sliver of the previous photo on screen
  // makes it obvious the row moved rather than jumped somewhere new.
  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: "smooth" });
  };

  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenAt(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page behind the overlay from scrolling with the wheel.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, step]);

  if (photos.length === 0) return null;

  return (
    <section>
      {/* Title bar: light band across the full width, as in the reference. */}
      <div className="bg-paper py-[clamp(14px,1.6vw,22px)] border-y border-hairline">
        <h2 className="text-center uppercase text-ink font-medium tracking-[0.22em] text-[clamp(15px,1.5vw,21px)] leading-none">
          {t.modelDetail.portfolio}
        </h2>
      </div>

      {/* Inline background: a band that silently loses its fill would leave the
          strip floating on the page background, so it is not left to a utility
          class — Tailwind has dropped arbitrary values in this project before. */}
      <div style={{ backgroundColor: "#E1D8F5" }} className="py-[clamp(14px,1.6vw,20px)]">
        <div className="flex gap-6 px-[clamp(16px,2vw,34px)] pb-[clamp(10px,1.2vw,16px)] text-[12px] tracking-[0.18em] uppercase">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            className="text-ink disabled:opacity-30 hover:text-accent transition-colors disabled:hover:text-ink"
          >
            {t.modelDetail.prev}
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            className="text-ink disabled:opacity-30 hover:text-accent transition-colors disabled:hover:text-ink"
          >
            {t.modelDetail.next}
          </button>
        </div>

        <div
          ref={scroller}
          onScroll={syncEdges}
          className="no-scrollbar flex overflow-x-auto"
          style={{ height: "clamp(300px, 44vw, 520px)", scrollSnapType: "x proximity" }}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenAt(i)}
              // aspect-ratio plus a full-height box lets each photo derive its
              // own width, so the row is a run of true proportions.
              style={{
                aspectRatio: `${photo.width ?? 3} / ${photo.height ?? 4}`,
                scrollSnapAlign: "start",
              }}
              className="group relative h-full shrink-0 cursor-zoom-in bg-placeholder"
              aria-label={`${modelName} — ${i + 1}`}
            >
              <Image
                src={assetUrl(photo.url)}
                alt={modelName}
                fill
                sizes="(max-width: 768px) 70vw, 34vw"
                quality={92}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          // Inline: Tailwind has repeatedly failed to emit arbitrary opacity
          // variants in this project, and a missing scrim is a silent failure.
          style={{ backgroundColor: "rgba(18, 14, 24, 0.94)" }}
          onClick={() => setOpenAt(null)}
          role="dialog"
          aria-modal="true"
        >
          <span className="absolute top-5 left-6 text-[13px] tracking-[0.14em] text-paperText/70 tabular-nums">
            {openAt + 1} / {photos.length}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenAt(null);
            }}
            aria-label={t.lightbox.close}
            className="absolute top-3.5 right-5 text-paperText/70 hover:text-paperText transition-colors text-3xl leading-none p-2"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t.lightbox.previousPhoto}
                className="absolute left-3 md:left-6 w-11 h-11 flex items-center justify-center bg-paperText/10 hover:bg-paperText/20 text-paperText transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t.lightbox.nextPhoto}
                className="absolute right-3 md:right-6 w-11 h-11 flex items-center justify-center bg-paperText/10 hover:bg-paperText/20 text-paperText transition-colors"
              >
                →
              </button>
            </>
          )}

          {/* object-contain so the whole frame is visible rather than cropped,
              and the click target stops here so hitting the photo does not close. */}
          <div className="relative w-[92vw] h-[86vh] md:w-[76vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              key={photos[openAt].id}
              src={assetUrl(photos[openAt].url)}
              alt={modelName}
              fill
              sizes="92vw"
              quality={95}
              priority
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
