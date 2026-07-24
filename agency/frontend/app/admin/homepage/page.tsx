"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getAdminSettings,
  updateAdminSettings,
  uploadHeroVideo,
  deleteHeroVideo,
  getAdminEditorialAlbums,
  uploadSettingsImage,
  deleteSettingsImage,
  assetUrl,
  SiteSettings,
  EditorialAlbum,
} from "@/lib/api";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import AdminEditorialAlbums from "@/components/AdminEditorialAlbums";
import AdminBilingualField from "@/components/AdminBilingualField";
import {
  card,
  cardStyle,
  sectionLabel,
  sectionLabelStyle,
  label,
  labelStyle,
  primaryBtn,
  primaryBtnStyle,
  colors,
} from "@/lib/adminTheme";

export default function AdminHomepagePage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [albums, setAlbums] = useState<EditorialAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAdminSettings(token), getAdminEditorialAlbums(token)])
      .then(([s, a]) => {
        setSettings(s);
        setAlbums(a);
      })
      .finally(() => setLoading(false));
  }, [token]);

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

  async function handleManifestoImage(file: File) {
    if (!token) return;
    const updated = await uploadSettingsImage(token, "manifesto", file);
    setSettings(updated);
  }

  async function handleManifestoImageRemove() {
    if (!token) return;
    const updated = await deleteSettingsImage(token, "manifesto");
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
        Видео, текст и редакционные истории на главной странице.
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

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Текст на главной
        </div>
        <div className="flex flex-col gap-3.5 mb-3.5">
          <AdminBilingualField
            labelText="Заголовок (часть 1)"
            enValue={settings.hero_pre ?? ""}
            ruValue={settings.hero_pre_ru ?? ""}
            onSaveEn={(v) => saveField({ hero_pre: v })}
            onSaveRu={(v) => saveField({ hero_pre_ru: v })}
          />
          <AdminBilingualField
            labelText="Заголовок (акцент)"
            enValue={settings.hero_em ?? ""}
            ruValue={settings.hero_em_ru ?? ""}
            onSaveEn={(v) => saveField({ hero_em: v })}
            onSaveRu={(v) => saveField({ hero_em_ru: v })}
          />
          <AdminBilingualField
            labelText="Заголовок (часть 2)"
            enValue={settings.hero_post ?? ""}
            ruValue={settings.hero_post_ru ?? ""}
            onSaveEn={(v) => saveField({ hero_post: v })}
            onSaveRu={(v) => saveField({ hero_post_ru: v })}
          />
        </div>
        <AdminBilingualField
          labelText="Текст абзаца"
          enValue={settings.hero_body ?? ""}
          ruValue={settings.hero_body_ru ?? ""}
          onSaveEn={(v) => saveField({ hero_body: v })}
          onSaveRu={(v) => saveField({ hero_body_ru: v })}
          multiline
        />
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Раздел манифеста
        </div>
        <div className="flex flex-col gap-3">
          <AdminBilingualField
            labelText="Заголовок"
            enValue={settings.manifesto_title ?? ""}
            ruValue={settings.manifesto_title_ru ?? ""}
            onSaveEn={(v) => saveField({ manifesto_title: v })}
            onSaveRu={(v) => saveField({ manifesto_title_ru: v })}
          />
          <AdminBilingualField
            labelText="Абзац 1"
            enValue={settings.manifesto_body1 ?? ""}
            ruValue={settings.manifesto_body1_ru ?? ""}
            onSaveEn={(v) => saveField({ manifesto_body1: v })}
            onSaveRu={(v) => saveField({ manifesto_body1_ru: v })}
            multiline
          />
          <AdminBilingualField
            labelText="Абзац 2 (используйте {city} для названия города)"
            enValue={settings.manifesto_body2 ?? ""}
            ruValue={settings.manifesto_body2_ru ?? ""}
            onSaveEn={(v) => saveField({ manifesto_body2: v })}
            onSaveRu={(v) => saveField({ manifesto_body2_ru: v })}
            multiline
          />
          <div className="flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Изображение раздела
            </label>
            <p className="text-xs" style={{ color: colors.text }}>
              На сайте отображается широким блоком (не 3:4, как карточки моделей) — превью ниже показывает примерные пропорции.
            </p>
            <div className="w-72">
              <AdminPhotoSlot
                url={settings.manifesto_image_url}
                label="Перетащите изображение"
                onUpload={handleManifestoImage}
                onRemove={settings.manifesto_image_url ? handleManifestoImageRemove : undefined}
                aspectClass="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <AdminEditorialAlbums albums={albums} setAlbums={setAlbums} />
      </div>
    </div>
  );
}
