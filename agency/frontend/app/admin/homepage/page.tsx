"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getAdminSettings,
  updateAdminSettings,
  uploadHeroVideo,
  deleteHeroVideo,
  uploadSettingsImage,
  deleteSettingsImage,
  assetUrl,
  SiteSettings,
} from "@/lib/api";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import {
  card,
  cardStyle,
  sectionLabel,
  sectionLabelStyle,
  primaryBtn,
  primaryBtnStyle,
  colors,
} from "@/lib/adminTheme";

export default function AdminHomepagePage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    getAdminSettings(token)
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCtaImageUpload(file: File) {
    if (!token) return;
    setSettings(await uploadSettingsImage(token, "cta", file));
  }

  async function handleCtaImageRemove() {
    if (!token) return;
    setSettings(await deleteSettingsImage(token, "cta"));
  }

  async function saveField(patch: Partial<SiteSettings>) {
    if (!token) return;
    const updated = await updateAdminSettings(token, patch);
    setSettings(updated);
  }

  async function handleVideoChange(fileList: FileList | null) {
    if (!fileList || !fileList[0] || !token) return;
    setVideoError(null);
    setUploading(true);
    try {
      const updated = await uploadHeroVideo(token, fileList[0]);
      setSettings(updated);
    } catch {
      setVideoError("Не удалось загрузить видео. Попробуйте файл меньшего размера.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleResetVideo() {
    if (!token) return;
    const updated = await deleteHeroVideo(token);
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
      <div className="text-2xl font-semibold mb-1">Главная страница</div>
      <div className="text-sm mb-7" style={{ color: colors.text }}>
        Видео на главной странице и фон блока «Открытый кастинг».
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Видео на главной
        </div>
        <div className="flex gap-5 items-start flex-wrap">
          <video
            src={settings.hero_video_url ? assetUrl(settings.hero_video_url) : undefined}
            poster={settings.hero_poster_url ? assetUrl(settings.hero_poster_url) : undefined}
            muted
            controls={!!settings.hero_video_url}
            className="w-[220px] aspect-video rounded-[8px] bg-black object-cover"
          />
          <div className="flex flex-col gap-2.5">
            <label className={`${primaryBtn} w-fit cursor-pointer`} style={primaryBtnStyle}>
              {uploading ? "Загрузка…" : "Загрузить новое видео"}
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleVideoChange(e.target.files)}
              />
            </label>
            {settings.hero_video_url && (
              <span onClick={handleResetVideo} className="text-xs cursor-pointer w-fit" style={{ color: colors.text }}>
                Сбросить по умолчанию
              </span>
            )}
            <p className="text-[11px] max-w-[260px]" style={{ color: "#B0A5CC" }}>
              MP4/WebM/MOV, до 100 МБ. Используется также на странице Академии.
            </p>
            {videoError && (
              <p className="text-xs" style={{ color: colors.danger }}>
                {videoError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Фон блока «Открытый кастинг»
        </div>
        <p className="text-[11px] mb-3 max-w-[320px]" style={{ color: colors.text }}>
          Широкое фото на всю ширину экрана. Поверх него ложатся надпись «Открытый кастинг»
          и кнопка, поэтому лучше подойдёт снимок без важных деталей по центру.
          Без фото блок остаётся сиреневым.
        </p>
        <div className="w-[260px]">
          <AdminPhotoSlot
            url={settings.cta_image_url}
            label="Перетащите фото для фона"
            aspectClass="aspect-[16/9]"
            onUpload={handleCtaImageUpload}
            onRemove={settings.cta_image_url ? handleCtaImageRemove : undefined}
          />
        </div>
      </div>
    </div>
  );
}
