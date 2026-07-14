"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { assetUrl, EditorialAlbum } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function EditorialLightbox({ albums }: { albums: EditorialAlbum[] }) {
  const { t } = useLanguage();
  const [openAlbumIndex, setOpenAlbumIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const album = openAlbumIndex !== null ? albums[openAlbumIndex] : null;

  const close = useCallback(() => setOpenAlbumIndex(null), []);
  const next = useCallback(() => {
    if (!album) return;
    setPhotoIndex((i) => (i + 1) % album.photos.length);
  }, [album]);
  const prev = useCallback(() => {
    if (!album) return;
    setPhotoIndex((i) => (i - 1 + album.photos.length) % album.photos.length);
  }, [album]);

  useEffect(() => {
    if (!album) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [album, close, next, prev]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {albums.map((a, i) => {
          const cover = a.photos[0];
          if (!cover) return null;
          return (
            <button
              key={a.id}
              onClick={() => {
                setOpenAlbumIndex(i);
                setPhotoIndex(0);
              }}
              className="relative aspect-[3/4] bg-placeholder overflow-hidden group"
            >
              <Image
                src={assetUrl(cover.url)}
                alt={a.title || "Editorial story"}
                fill
                sizes="20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {a.title && (
                <span className="absolute bottom-0 left-0 right-0 p-3 text-[11px] tracking-[0.1em] uppercase text-paperText bg-gradient-to-t from-black/60 to-transparent">
                  {a.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {album && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center animate-fade-up"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-paperText text-2xl leading-none w-10 h-10 flex items-center justify-center hover:text-accentDeep transition-colors"
            aria-label={t.lightbox.close}
          >
            ×
          </button>

          {album.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-paperText text-3xl w-12 h-12 flex items-center justify-center hover:text-accentDeep transition-colors"
              aria-label={t.lightbox.previousPhoto}
            >
              ←
            </button>
          )}

          <div
            className="relative w-[86vw] h-[82vh] md:w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={assetUrl(album.photos[photoIndex].url)}
              alt={album.title || "Editorial story"}
              fill
              sizes="80vw"
              className="object-contain"
              priority
            />
          </div>

          {album.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-paperText text-3xl w-12 h-12 flex items-center justify-center hover:text-accentDeep transition-colors"
              aria-label={t.lightbox.nextPhoto}
            >
              →
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-paperText/80 text-xs tracking-[0.14em] uppercase">
            {album.title ? `${album.title} — ` : ""}
            {photoIndex + 1} / {album.photos.length}
          </div>
        </div>
      )}
    </>
  );
}
