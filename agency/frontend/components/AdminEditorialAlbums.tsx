"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  updateEditorialAlbum,
  uploadEditorialPhotos,
  deleteEditorialPhoto,
  assetUrl,
  EditorialAlbum,
} from "@/lib/api";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import { colors, input, inputStyle } from "@/lib/adminTheme";

const MAX_PHOTOS = 10;

export default function AdminEditorialAlbums({
  albums,
  setAlbums,
}: {
  albums: EditorialAlbum[];
  setAlbums: (updater: (prev: EditorialAlbum[]) => EditorialAlbum[]) => void;
}) {
  const { token } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(albums[0]?.id ?? null);

  const totalPhotos = albums.reduce((sum, a) => sum + a.photos.length, 0);
  const selected = albums.find((a) => a.id === selectedId) ?? null;

  function replace(updated: EditorialAlbum) {
    setAlbums((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  async function handleCoverUpload(album: EditorialAlbum, file: File) {
    if (!token) return;
    const updated = await uploadEditorialPhotos(token, album.id, [file]);
    replace(updated);
    setSelectedId(album.id);
  }

  async function handleAddPhotos(album: EditorialAlbum, files: FileList | null) {
    if (!token || !files || files.length === 0) return;
    const updated = await uploadEditorialPhotos(token, album.id, Array.from(files));
    replace(updated);
  }

  async function handleRemovePhoto(album: EditorialAlbum, photoId: number) {
    if (!token) return;
    const updated = await deleteEditorialPhoto(token, album.id, photoId);
    replace(updated);
  }

  async function handleTitleBlur(album: EditorialAlbum, title: string) {
    if (!token) return;
    const updated = await updateEditorialAlbum(token, album.id, { title });
    replace(updated);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[22px] font-bold">Редакционные истории</div>
        </div>
        <p className="text-xs text-right" style={{ color: colors.text }}>
          {totalPhotos} фото · нажмите на обложку, чтобы открыть альбом
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-5">
        {albums.map((album) => {
          const cover = album.photos[0];
          const active = album.id === selectedId;
          return (
            <div
              key={album.id}
              onClick={() => setSelectedId(album.id)}
              className="cursor-pointer rounded-[8px]"
              style={{ outline: active ? `2px solid ${colors.accent}` : "none", outlineOffset: "2px" }}
            >
              <AdminPhotoSlot
                url={cover?.url ?? null}
                label="Перетащите фото или выберите файл"
                onUpload={(file) => handleCoverUpload(album, file)}
                clickToUpload={false}
              />
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="border rounded-[8px] p-4" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <input
              defaultValue={selected.title ?? ""}
              onBlur={(e) => handleTitleBlur(selected, e.target.value)}
              placeholder="Название альбома (необязательно)"
              className={`${input} !w-auto min-w-[220px]`}
              style={inputStyle}
            />
            <label
              className="px-3 py-1.5 border rounded-[6px] text-xs cursor-pointer"
              style={{ borderColor: colors.inputBorder, opacity: selected.photos.length >= MAX_PHOTOS ? 0.4 : 1 }}
            >
              + Добавить фото ({selected.photos.length}/{MAX_PHOTOS})
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={selected.photos.length >= MAX_PHOTOS}
                className="hidden"
                onChange={(e) => {
                  handleAddPhotos(selected, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5">
            {selected.photos.map((photo) => (
              <AdminPhotoSlot
                key={photo.id}
                url={photo.url}
                label=""
                onUpload={async (file) => {
                  if (!token) return;
                  await deleteEditorialPhoto(token, selected.id, photo.id);
                  const updated = await uploadEditorialPhotos(token, selected.id, [file]);
                  replace(updated);
                }}
                onRemove={() => handleRemovePhoto(selected, photo.id)}
              />
            ))}
            {selected.photos.length === 0 && (
              <p className="text-xs col-span-full" style={{ color: colors.text }}>
                В этом альбоме пока нет фото — добавьте до {MAX_PHOTOS} выше.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
