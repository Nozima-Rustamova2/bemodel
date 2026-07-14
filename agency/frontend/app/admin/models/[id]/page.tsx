"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getAdminModel,
  updateModel,
  uploadPhotos,
  deletePhoto,
  setCoverPhoto,
  uploadVideos,
  deleteVideo,
  assetUrl,
  ModelDetail,
} from "@/lib/api";
import AdminModelFormFields, { ModelDraft } from "@/components/AdminModelFormFields";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import {
  card,
  cardStyle,
  sectionLabel,
  sectionLabelStyle,
  colors,
  primaryBtn,
  primaryBtnStyle,
  secondaryBtn,
  secondaryBtnStyle,
} from "@/lib/adminTheme";

function draftFromModel(m: ModelDetail): ModelDraft {
  return {
    name: m.name,
    city: m.city || "",
    category: m.category,
    height: m.height || "",
    bust: m.bust || "",
    waist: m.waist || "",
    hips: m.hips || "",
    shoes: m.shoes || "",
    hair: m.hair || "",
    eyes: m.eyes || "",
    bio: m.bio || "",
    is_featured: m.is_featured,
  };
}

export default function EditModelPage() {
  const params = useParams<{ id: string }>();
  const modelId = Number(params.id);
  const { token } = useAuth();
  const router = useRouter();
  const [model, setModel] = useState<ModelDetail | null>(null);
  const [draft, setDraft] = useState<ModelDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    const m = await getAdminModel(token, modelId);
    setModel(m);
    return m;
  }, [token, modelId]);

  useEffect(() => {
    if (!token) return;
    refresh()
      .then((m) => m && setDraft(draftFromModel(m)))
      .finally(() => setLoading(false));
  }, [token, refresh]);

  async function handleSave() {
    if (!token || !draft) return;
    setSaving(true);
    try {
      await updateModel(token, modelId, draft);
      router.push("/admin/models");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !model || !draft)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  const cover = model.photos.find((p) => p.is_cover) || model.photos[0];
  const rest = model.photos.filter((p) => p.id !== cover?.id);
  const portfolio = rest.slice(0, 3);
  const polaroids = rest.slice(3, 7);
  const portfolioLabels = ["Портрет", "В полный рост", "Редакционное"];
  const polaroidLabels = ["Анфас", "Профиль", "В полный рост", "Улыбка"];

  async function uploadAndRefresh(file: File) {
    if (!token) return;
    await uploadPhotos(token, modelId, [file]);
    await refresh();
  }

  async function uploadAsCover(file: File) {
    if (!token) return;
    const [uploaded] = await uploadPhotos(token, modelId, [file]);
    if (uploaded) await setCoverPhoto(token, modelId, uploaded.id);
    await refresh();
  }

  async function replaceSlot(existingId: number | undefined, file: File) {
    if (!token) return;
    if (existingId) await deletePhoto(token, modelId, existingId);
    await uploadPhotos(token, modelId, [file]);
    await refresh();
  }

  async function removePhoto(photoId: number) {
    if (!token) return;
    await deletePhoto(token, modelId, photoId);
    await refresh();
  }

  async function handleVideoUpload(file: File) {
    if (!token) return;
    await uploadVideos(token, modelId, [file]);
    await refresh();
  }

  async function handleVideoRemove(videoId: number) {
    if (!token) return;
    await deleteVideo(token, modelId, videoId);
    await refresh();
  }

  return (
    <div>
      <div
        onClick={() => router.push("/admin/models")}
        className="text-[13px] cursor-pointer mb-[18px]"
        style={{ color: colors.text }}
      >
        ← Назад к моделям
      </div>
      <div className="flex items-center justify-between mb-7">
        <div className="text-[22px] font-semibold">{model.name}</div>
        <div className="flex gap-2.5">
          <button onClick={() => router.push("/admin/models")} className={secondaryBtn} style={secondaryBtnStyle}>
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`${primaryBtn} disabled:opacity-50`}
            style={primaryBtnStyle}
          >
            {saving ? "Сохранение…" : "Сохранить модель"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminModelFormFields draft={draft} setDraft={(updater) => setDraft((d) => (d ? updater(d) : d))} />

        <div className="flex flex-col gap-[18px]">
          <div className={`${card} p-[22px]`} style={cardStyle}>
            <div className={sectionLabel} style={sectionLabelStyle}>
              Фото карточки
            </div>
            <div className="w-40">
              <AdminPhotoSlot
                url={cover?.url}
                label="Перетащите фото карточки"
                onUpload={uploadAsCover}
                onRemove={cover ? () => removePhoto(cover.id) : undefined}
              />
            </div>
          </div>

          <div className={`${card} p-[22px]`} style={cardStyle}>
            <div className={sectionLabel} style={sectionLabelStyle}>
              Портфолио (3 фото)
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <AdminPhotoSlot
                  key={i}
                  url={portfolio[i]?.url}
                  label={portfolioLabels[i]}
                  onUpload={(file) => replaceSlot(portfolio[i]?.id, file)}
                  onRemove={portfolio[i] ? () => removePhoto(portfolio[i].id) : undefined}
                />
              ))}
            </div>
          </div>

          <div className={`${card} p-[22px]`} style={cardStyle}>
            <div className={sectionLabel} style={sectionLabelStyle}>
              Полароиды / дигиталы (4 фото)
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <AdminPhotoSlot
                  key={i}
                  url={polaroids[i]?.url}
                  label={polaroidLabels[i]}
                  onUpload={(file) => replaceSlot(polaroids[i]?.id, file)}
                  onRemove={polaroids[i] ? () => removePhoto(polaroids[i].id) : undefined}
                />
              ))}
            </div>
          </div>

          <div className={`${card} p-[22px]`} style={cardStyle}>
            <div className={sectionLabel} style={sectionLabelStyle}>
              Видео портфолио
            </div>
            {model.videos.length > 0 && (
              <div className="flex flex-col gap-2.5 mb-3.5">
                {model.videos.map((v) => (
                  <div key={v.id} className="flex items-center gap-3">
                    <video src={assetUrl(v.url)} muted className="w-28 aspect-video rounded-[6px] object-cover bg-black" />
                    <button
                      onClick={() => handleVideoRemove(v.id)}
                      className="text-xs"
                      style={{ color: colors.danger }}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              className={`${primaryBtn} w-fit cursor-pointer`}
              style={primaryBtnStyle}
            >
              Загрузить видео
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
