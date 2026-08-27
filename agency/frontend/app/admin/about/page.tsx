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

      <div className={`${card} p-[22px] mt-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Реквизиты
        </div>
        <p className="text-[11px] mb-3.5 max-w-[520px]" style={{ color: colors.text }}>
          Юридические данные компании — название, ИНН, адрес и всё остальное, что нужно указать.
          Открываются по ссылке «Реквизиты» внизу сайта. Пока поле пустое, ссылка не показывается.
          Переносы строк сохраняются.
        </p>
        <AdminBilingualField
          labelText="Текст реквизитов"
          enValue={settings.legal_details ?? ""}
          ruValue={settings.legal_details_ru ?? ""}
          onSaveEn={(v) => saveField({ legal_details: v })}
          onSaveRu={(v) => saveField({ legal_details_ru: v })}
          multiline
          rows={7}
        />
      </div>
    </div>
  );
}
