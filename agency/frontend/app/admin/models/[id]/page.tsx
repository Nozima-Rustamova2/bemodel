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

const PORTFOLIO_SLOTS = 8;
const POLAROID_SLOTS = 4;

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
  const rest = model.photos.filter((p) => p.id !== cover?.id);
  const portfolio = rest.slice(0, PORTFOLIO_SLOTS);
  const polaroids = rest.slice(PORTFOLIO_SLOTS, PORTFOLIO_SLOTS + POLAROID_SLOTS);
  const portfolioLabels = [
    "Портрет",
    "В полный рост",
    "Редакционное",
    "Крупный план",
    "Образ 5",
    "Образ 6",
    "Образ 7",
    "Образ 8",
  ];
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
              Портфолио ({PORTFOLIO_SLOTS} фото)
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: PORTFOLIO_SLOTS }, (_, i) => (
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
              Полароиды / дигиталы ({POLAROID_SLOTS} фото)
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: POLAROID_SLOTS }, (_, i) => (
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
        </div>
      </div>
    </div>
  );
}
