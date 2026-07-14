"use client";

import { useState } from "react";
import { ModelDetail, PressPost } from "@/lib/api";

export interface PressFormValues {
  title: string;
  excerpt: string;
  body: string;
  external_link: string;
  model_id: number | null;
  is_published: boolean;
}

export function emptyPressFormValues(post?: PressPost): PressFormValues {
  return {
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    external_link: post?.external_link ?? "",
    model_id: post?.model_id ?? null,
    is_published: post?.is_published ?? false,
  };
}

export default function PressForm({
  initialValues,
  models,
  onSubmit,
  submitLabel,
}: {
  initialValues: PressFormValues;
  models: ModelDetail[];
  onSubmit: (values: PressFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PressFormValues>(key: K, value: PressFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border border-hairline px-3 py-2 text-sm focus:outline-none focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="eyebrow block mb-1.5">Заголовок</label>
        <input
          required
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="eyebrow block mb-1.5">Краткое описание</label>
        <textarea
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className={inputClass}
          placeholder="Короткий анонс для списков"
        />
      </div>

      <div>
        <label className="eyebrow block mb-1.5">Текст</label>
        <textarea
          rows={8}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="eyebrow block mb-1.5">Связанная модель (необязательно)</label>
          <select
            value={values.model_id ?? ""}
            onChange={(e) => set("model_id", e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          >
            <option value="">Нет</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow block mb-1.5">Внешняя ссылка (необязательно)</label>
          <input
            value={values.external_link}
            onChange={(e) => set("external_link", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) => set("is_published", e.target.checked)}
        />
        Опубликовано (видно на сайте)
      </label>

      {error && <p className="text-accent text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-paper px-5 py-2.5 text-sm eyebrow hover:bg-accent transition-colors disabled:opacity-50"
      >
        {submitting ? "Сохранение..." : submitLabel}
      </button>
    </form>
  );
}
