"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { getAdminModels, deleteModel, assetUrl, ModelDetail } from "@/lib/api";
import { card, cardStyle, colors, primaryBtn, primaryBtnStyle, dangerBtn, dangerBtnStyle } from "@/lib/adminTheme";

type Filter = "all" | "Model" | "New Faces";

export default function AdminModelsListPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<ModelDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!token) return;
    getAdminModels(token)
      .then(setModels)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(model: ModelDetail) {
    if (!token) return;
    if (!confirm(`Удалить ${model.name}? Это действие нельзя отменить.`)) return;
    await deleteModel(token, model.id);
    setModels((prev) => prev.filter((m) => m.id !== model.id));
  }

  if (loading)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  const filtered = filter === "all" ? models : models.filter((m) => m.category === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "Model", label: "Модели" },
    { key: "New Faces", label: "Новые лица" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-2xl font-semibold">Модели</div>
        <button
          onClick={() => router.push("/admin/models/new")}
          className={primaryBtn}
          style={primaryBtnStyle}
        >
          + Добавить модель
        </button>
      </div>
      <div className="text-sm mb-6" style={{ color: colors.text }}>
        {models.length} моделей в составе агентства
      </div>

      <div className="flex gap-5 mb-5 text-[13px]">
        {tabs.map((t) => {
          const active = filter === t.key;
          return (
            <span
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="cursor-pointer pb-1.5"
              style={{
                color: active ? colors.ink : "#B0A5CC",
                borderBottom: active ? `2px solid ${colors.ink}` : "2px solid transparent",
              }}
            >
              {t.label}
            </span>
          );
        })}
      </div>

      <div className={`${card} overflow-hidden`} style={cardStyle}>
        {filtered.length === 0 ? (
          <div className="p-8 text-sm text-center" style={{ color: colors.text }}>
            В этом разделе пока нет моделей.
          </div>
        ) : (
          filtered.map((model, i) => {
            const cover = model.photos.find((p) => p.is_cover) || model.photos[0];
            return (
              <div
                key={model.id}
                className="flex items-center gap-3.5 px-[18px] py-3"
                style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${colors.hairline}` : "none" }}
              >
                <div
                  className="relative w-11 h-11 rounded-[8px] overflow-hidden shrink-0"
                  style={{ background: colors.placeholder }}
                >
                  {cover && (
                    <Image src={assetUrl(cover.url)} alt={model.name} fill sizes="44px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{model.name}</div>
                  <div className="text-xs" style={{ color: colors.text }}>
                    {model.city || "—"} · {model.category === "Model" ? "Модель" : "Новое лицо"}
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/admin/models/${model.id}`)}
                  className="px-3.5 py-[7px] border rounded-[7px] text-xs cursor-pointer transition-colors"
                  style={{ borderColor: colors.inputBorder }}
                >
                  Изменить
                </button>
                <button onClick={() => handleDelete(model)} className={dangerBtn} style={dangerBtnStyle}>
                  Удалить
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
