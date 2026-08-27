"use client";

import { card, cardStyle, sectionLabel, sectionLabelStyle, label, labelStyle, input, inputStyle, textarea } from "@/lib/adminTheme";

export interface ModelDraft {
  name: string;
  category: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  hair: string;
  eyes: string;
  bio: string;
  is_published: boolean;
}

export function emptyDraft(): ModelDraft {
  return {
    name: "",
    category: "Model",
    height: "",
    bust: "",
    waist: "",
    hips: "",
    shoes: "",
    hair: "",
    eyes: "",
    bio: "",
    is_published: true,
  };
}

function Field({
  labelText,
  value,
  onChange,
}: {
  labelText: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} style={labelStyle}>
        {labelText}
      </label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={input} style={inputStyle} />
    </div>
  );
}

export default function AdminModelFormFields({
  draft,
  setDraft,
}: {
  draft: ModelDraft;
  setDraft: (updater: (d: ModelDraft) => ModelDraft) => void;
}) {
  const set = <K extends keyof ModelDraft>(key: K, value: ModelDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="flex flex-col gap-[18px]">
      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Профиль
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2">
            <Field labelText="Имя" value={draft.name} onChange={(v) => set("name", v)} />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Категория
            </label>
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className={input}
              style={inputStyle}
            >
              <option value="Model">Модель</option>
              <option value="New Faces">Новое лицо</option>
            </select>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
              />
              Опубликовано (видно на сайте)
            </label>
          </div>
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Параметры
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <Field labelText="Рост (см)" value={draft.height} onChange={(v) => set("height", v)} />
          <Field labelText="Грудь (см)" value={draft.bust} onChange={(v) => set("bust", v)} />
          <Field labelText="Талия (см)" value={draft.waist} onChange={(v) => set("waist", v)} />
          <Field labelText="Бёдра (см)" value={draft.hips} onChange={(v) => set("hips", v)} />
          <Field labelText="Обувь (EU)" value={draft.shoes} onChange={(v) => set("shoes", v)} />
          <Field labelText="Волосы" value={draft.hair} onChange={(v) => set("hair", v)} />
          <Field labelText="Глаза" value={draft.eyes} onChange={(v) => set("eyes", v)} />
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Био / заметки
        </div>
        <textarea
          value={draft.bio}
          onChange={(e) => set("bio", e.target.value)}
          rows={4}
          placeholder="Внутренние заметки об этой модели…"
          className={textarea}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
