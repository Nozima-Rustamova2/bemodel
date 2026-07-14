"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { assetUrl } from "@/lib/api";
import { colors } from "@/lib/adminTheme";

export default function AdminPhotoSlot({
  url,
  label,
  onUpload,
  onRemove,
}: {
  url?: string | null;
  label: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="relative aspect-[3/4] rounded-[8px] overflow-hidden cursor-pointer group"
      style={{ background: colors.placeholder, outline: dragOver ? `2px solid ${colors.accent}` : "none" }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {url ? (
        <Image src={assetUrl(url)} alt={label} fill sizes="200px" className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center px-2">
          <span className="text-[11px]" style={{ color: colors.text }}>
            {busy ? "Загрузка…" : label}
          </span>
        </div>
      )}
      {url && onRemove && (
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            await onRemove();
          }}
          className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
}
