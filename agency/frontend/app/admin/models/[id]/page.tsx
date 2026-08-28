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
  reorderPhotos,
  ModelDetail,
} from "@/lib/api";
import AdminModelFormFields, { ModelDraft } from "@/components/AdminModelFormFields";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import AdminPhotoManager from "@/components/AdminPhotoManager";
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
    category: m.category,
    height: m.height || "",
    bust: m.bust || "",
    waist: m.waist || "",
    hips: m.hips || "",
    shoes: m.shoes || "",
    hair: m.hair || "",
    eyes: m.eyes || "",
    bio: m.bio || "",
    is_published: m.is_published,
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
  // The cover carries the top of the model's page; everything else is portfolio,
  // in whatever order it is arranged here.
  const portfolio = model.photos
    .filter((p) => p.id !== cover?.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  async function uploadAsCover(file: File) {
    if (!token) return;
    const [uploaded] = await uploadPhotos(token, modelId, [file]);
    if (uploaded) await setCoverPhoto(token, modelId, uploaded.id);
    await refresh();
  }

  async function addPortfolioPhotos(files: File[]) {
    if (!token) return;
    await uploadPhotos(token, modelId, files);
    await refresh();
  }

  async function removePhoto(photoId: number) {
    if (!token) return;
    await deletePhoto(token, modelId, photoId);
    await refresh();
  }

  async function makeCover(photoId: number) {
    if (!token) return;
    await setCoverPhoto(token, modelId, photoId);
    await refresh();
  }

  async function movePhoto(photoId: number, direction: -1 | 1) {
    if (!token || !model) return;
    const ids = portfolio.map((p) => p.id);
    const from = ids.indexOf(photoId);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    // The cover leads the stored order so it keeps sorting ahead of the rest.
    await reorderPhotos(token, modelId, cover ? [cover.id, ...ids] : ids);
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
              Главное фото
            </div>
            <p className="text-[11px] mb-3" style={{ color: colors.text }}>
              Показывается только на странице модели, квадратом на половину экрана.
              В списке моделей карточка листает первые два фото портфолио.
            </p>
            <div className="w-40">
              <AdminPhotoSlot
                url={cover?.url}
                label="Перетащите главное фото"
                aspectClass="aspect-square"
                onUpload={uploadAsCover}
                onRemove={cover ? () => removePhoto(cover.id) : undefined}
              />
            </div>
          </div>

          <div className={`${card} p-[22px]`} style={cardStyle}>
            <div className={sectionLabel} style={sectionLabelStyle}>
              Портфолио ({portfolio.length} фото)
            </div>
            <p className="text-[11px] mb-3" style={{ color: colors.text }}>
              Без ограничения по количеству. Порядок здесь — порядок в ленте на странице модели.
              ★ — сделать фото карточки, ← → — переставить.
            </p>
            <AdminPhotoManager
              photos={portfolio}
              onUpload={addPortfolioPhotos}
              onRemove={removePhoto}
              onMove={movePhoto}
              onSetCover={makeCover}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
