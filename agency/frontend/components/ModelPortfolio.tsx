"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { assetUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export type PortfolioPhoto = { id: number; url: string };

const POLAROID_KEYS = ["front", "profile", "fullLength", "smile"] as const;

export default function ModelPortfolio({
  gallery,
  polaroids,
  modelName,
}: {
  gallery: PortfolioPhoto[];
  polaroids: PortfolioPhoto[];
  modelName: string;
}) {
  const { t } = useLanguage();

  // One continuous sequence so the lightbox arrows run straight from the
  // portfolio into the polaroids, matching what the page shows top to bottom.
  const all = [...gallery, ...polaroids];
  const [openAt, setOpenAt] = useState<number | null>(null);
  const isOpen = openAt !== null;

  const step = useCallback(
    (delta: number) => setOpenAt((i) => (i === null ? i : (i + delta + all.length) % all.length)),
    [all.length],
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

  const polaroidLabel = (i: number) => t.photoLabels[POLAROID_KEYS[i] ?? "front"];

  return (
    <>
      {gallery.length === 0 ? (
        <p className="text-inkSoft text-sm">{t.modelDetail.noPhotosYet}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {gallery.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenAt(i)}
              className="group relative aspect-[3/4] bg-placeholder overflow-hidden cursor-zoom-in"
              aria-label={`${modelName} — ${i + 1}`}
            >
              <Image
                src={assetUrl(photo.url)}
                alt={modelName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 38vw"
                quality={92}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
            </button>
          ))}
        </div>
      )}

      {polaroids.length > 0 && (
        <>
          <p className="eyebrow text-accent mt-14 mb-2">{t.modelDetail.polaroidsDigitals}</p>
          <p className="text-[13px] font-light text-taupe mb-5">{t.modelDetail.polaroidNote}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {polaroids.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setOpenAt(gallery.length + i)}
                className="bg-polaroid p-[10px_10px_34px] shadow-[0_8px_22px_rgba(33,29,24,0.10)] border border-ink/[0.06] text-left cursor-zoom-in"
              >
                <div className="group relative aspect-[3/4] bg-placeholder overflow-hidden">
                  <Image
                    src={assetUrl(photo.url)}
                    alt={polaroidLabel(i)}
                    fill
                    sizes="(max-width: 768px) 50vw, 260px"
                    quality={90}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
                </div>
                <p className="mono-caption text-center mt-3">{polaroidLabel(i)}</p>
              </button>
            ))}
          </div>
        </>
      )}

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
            {openAt + 1} / {all.length}
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

          {all.length > 1 && (
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
          <div
            className="relative w-[92vw] h-[86vh] md:w-[76vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={all[openAt].id}
              src={assetUrl(all[openAt].url)}
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
    </>
  );
}
