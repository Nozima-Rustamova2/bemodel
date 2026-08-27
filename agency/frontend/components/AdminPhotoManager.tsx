"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Photo, assetUrl } from "@/lib/api";
import { colors } from "@/lib/adminTheme";

/**
 * Portfolio photo grid with no fixed number of slots: add as many as you like,
 * drop any of them, and drag the order around. Order here is the order the
 * strip on the model's page shows them in.
 */
export default function AdminPhotoManager({
  photos,
  onUpload,
  onRemove,
  onMove,
  onSetCover,
}: {
  photos: Photo[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (photoId: number) => Promise<void>;
  onMove: (photoId: number, direction: -1 | 1) => Promise<void>;
  onSetCover: (photoId: number) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    setBusy(true);
    try {
      await onUpload(files);
    } finally {
      setBusy(false);
      // Let the same file be picked again after a delete-and-re-add.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3" style={{ opacity: busy ? 0.6 : 1 }}>
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="relative aspect-[3/4] rounded-[8px] overflow-hidden group"
          style={{ background: colors.placeholder }}
        >
          <Image src={assetUrl(photo.url)} alt="" fill sizes="200px" className="object-cover" />

          <div className="absolute inset-x-0 top-0 flex justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              title="Сделать главным фото"
              onClick={() => run(() => onSetCover(photo.id))}
              disabled={busy}
              className="px-1.5 h-5 flex items-center rounded-full bg-black/60 text-white text-[10px] disabled:opacity-40"
            >
              ★
            </button>
            <button
              type="button"
              title="Удалить"
              onClick={() => run(() => onRemove(photo.id))}
              disabled={busy}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs disabled:opacity-40"
            >
              ×
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              title="Раньше"
              onClick={() => run(() => onMove(photo.id, -1))}
              disabled={busy || i === 0}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs disabled:opacity-25"
            >
              ←
            </button>
            <button
              type="button"
              title="Позже"
              onClick={() => run(() => onMove(photo.id, 1))}
              disabled={busy || i === photos.length - 1}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs disabled:opacity-25"
            >
              →
            </button>
          </div>
        </div>
      ))}

      {/* Always last, so the grid grows towards it rather than around it. */}
      <div
        className="relative aspect-[3/4] rounded-[8px] overflow-hidden cursor-pointer flex items-center justify-center text-center px-2"
        style={{
          background: colors.placeholder,
          outline: dragOver ? `2px solid ${colors.accent}` : "none",
        }}
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="text-[11px]" style={{ color: colors.text }}>
          {busy ? "Загрузка…" : "+ Добавить фото"}
        </span>
      </div>
    </div>
  );
}
