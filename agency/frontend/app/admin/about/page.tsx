"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getAdminSettings, updateAdminSettings, SiteSettings } from "@/lib/api";
import AdminBilingualField from "@/components/AdminBilingualField";
import { card, cardStyle, sectionLabel, sectionLabelStyle, colors } from "@/lib/adminTheme";

export default function AdminAboutPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminSettings(token)
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [token]);

  async function saveField(patch: Partial<SiteSettings>) {
    if (!token) return;
    const updated = await updateAdminSettings(token, patch);
    setSettings(updated);
  }

  if (loading || !settings)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  const steps = [
    {
      titleKey: "about_step1_title",
      bodyKey: "about_step1_body",
      titleRuKey: "about_step1_title_ru",
      bodyRuKey: "about_step1_body_ru",
      title: settings.about_step1_title,
      body: settings.about_step1_body,
      titleRu: settings.about_step1_title_ru,
      bodyRu: settings.about_step1_body_ru,
    },
    {
      titleKey: "about_step2_title",
      bodyKey: "about_step2_body",
      titleRuKey: "about_step2_title_ru",
      bodyRuKey: "about_step2_body_ru",
      title: settings.about_step2_title,
      body: settings.about_step2_body,
      titleRu: settings.about_step2_title_ru,
      bodyRu: settings.about_step2_body_ru,
    },
    {
      titleKey: "about_step3_title",
      bodyKey: "about_step3_body",
      titleRuKey: "about_step3_title_ru",
      bodyRuKey: "about_step3_body_ru",
      title: settings.about_step3_title,
      body: settings.about_step3_body,
      titleRu: settings.about_step3_title_ru,
      bodyRu: settings.about_step3_body_ru,
    },
  ] as const;

  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Страница «О нас»</div>
      <div className="text-sm mb-7" style={{ color: colors.text }}>
        История агентства и этапы работы.
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className="flex flex-col gap-3">
          <AdminBilingualField
            labelText="Заголовок"
            enValue={settings.about_heading ?? ""}
            ruValue={settings.about_heading_ru ?? ""}
            onSaveEn={(v) => saveField({ about_heading: v })}
            onSaveRu={(v) => saveField({ about_heading_ru: v })}
          />
          <AdminBilingualField
            labelText="Абзац 1 (используйте {name}/{city})"
            enValue={settings.about_body1 ?? ""}
            ruValue={settings.about_body1_ru ?? ""}
            onSaveEn={(v) => saveField({ about_body1: v })}
            onSaveRu={(v) => saveField({ about_body1_ru: v })}
            multiline
            rows={3}
          />
          <AdminBilingualField
            labelText="Абзац 2"
            enValue={settings.about_body2 ?? ""}
            ruValue={settings.about_body2_ru ?? ""}
            onSaveEn={(v) => saveField({ about_body2: v })}
            onSaveRu={(v) => saveField({ about_body2_ru: v })}
            multiline
            rows={3}
          />
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Этапы работы
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {steps.map((step, i) => (
            <div key={i} className="border rounded-[8px] p-3.5 flex flex-col gap-2.5" style={{ borderColor: colors.hairline }}>
              <AdminBilingualField
                labelText={`Название этапа ${i + 1}`}
                enValue={step.title ?? ""}
                ruValue={step.titleRu ?? ""}
                onSaveEn={(v) => saveField({ [step.titleKey]: v } as Partial<SiteSettings>)}
                onSaveRu={(v) => saveField({ [step.titleRuKey]: v } as Partial<SiteSettings>)}
              />
              <AdminBilingualField
                labelText="Описание"
                enValue={step.body ?? ""}
                ruValue={step.bodyRu ?? ""}
                onSaveEn={(v) => saveField({ [step.bodyKey]: v } as Partial<SiteSettings>)}
                onSaveRu={(v) => saveField({ [step.bodyRuKey]: v } as Partial<SiteSettings>)}
                multiline
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
