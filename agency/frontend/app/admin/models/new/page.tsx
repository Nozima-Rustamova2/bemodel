"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createModel } from "@/lib/api";
import AdminModelFormFields, { emptyDraft, ModelDraft } from "@/components/AdminModelFormFields";
import { card, cardStyle, colors, primaryBtn, primaryBtnStyle, secondaryBtn, secondaryBtnStyle } from "@/lib/adminTheme";

export default function NewModelPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [draft, setDraft] = useState<ModelDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      const model = await createModel(token, draft);
      router.push(`/admin/models/${model.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => router.push("/admin/models")}
        className="text-[13px] cursor-pointer mb-4.5 mb-[18px]"
        style={{ color: colors.text }}
      >
        ← Назад к моделям
      </div>
      <div className="flex items-center justify-between mb-7">
        <div className="text-[22px] font-semibold">Новая модель</div>
        <div className="flex gap-2.5">
          <button onClick={() => router.push("/admin/models")} className={secondaryBtn} style={secondaryBtnStyle}>
            Отмена
          </button>
          <button onClick={handleSave} disabled={saving} className={`${primaryBtn} disabled:opacity-50`} style={primaryBtnStyle}>
            {saving ? "Создание…" : "Создать модель"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminModelFormFields draft={draft} setDraft={setDraft} />
        <div className={`${card} p-[22px] h-fit`} style={cardStyle}>
          <p className="text-sm" style={{ color: colors.text }}>
            Сначала сохраните профиль — загрузка фото и видео станет доступна после создания модели.
          </p>
        </div>
      </div>
    </div>
  );
}
