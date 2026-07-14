"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import {
  getAdminLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonImage,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getAdminSettings,
  updateAdminSettings,
  uploadSettingsVideo,
  deleteSettingsVideo,
  uploadSettingsImage,
  deleteSettingsImage,
  assetUrl,
  AcademyLesson,
  AcademyFaq,
  SiteSettings,
} from "@/lib/api";
import AdminPhotoSlot from "@/components/AdminPhotoSlot";
import AdminBilingualField from "@/components/AdminBilingualField";
import {
  card,
  cardStyle,
  sectionLabel,
  sectionLabelStyle,
  label,
  labelStyle,
  input,
  inputStyle,
  primaryBtn,
  primaryBtnStyle,
  colors,
} from "@/lib/adminTheme";

function LessonRow({
  lesson,
  onChange,
  onDelete,
}: {
  lesson: AcademyLesson;
  onChange: (lesson: AcademyLesson) => void;
  onDelete: () => void;
}) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  async function save(patch: { title?: string; note?: string; title_ru?: string; note_ru?: string }) {
    if (!token) return;
    const updated = await updateLesson(token, lesson.id, patch);
    onChange(updated);
  }

  async function handleImage(fileList: FileList | null) {
    if (!fileList || !fileList[0] || !token) return;
    const updated = await uploadLessonImage(token, lesson.id, fileList[0]);
    onChange(updated);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex gap-3 items-start border rounded-[8px] p-3" style={{ borderColor: colors.hairline }}>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-[70px] aspect-[4/3] rounded-[6px] overflow-hidden shrink-0 cursor-pointer"
        style={{ background: colors.placeholder }}
      >
        {lesson.image_url && (
          <Image src={assetUrl(lesson.image_url)} alt="" fill sizes="70px" className="object-cover" />
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files)} />
      </div>
      <div className="flex-1 flex flex-col gap-2.5">
        <AdminBilingualField
          labelText="Название урока"
          enValue={lesson.title}
          ruValue={lesson.title_ru ?? ""}
          onSaveEn={(v) => save({ title: v })}
          onSaveRu={(v) => save({ title_ru: v })}
        />
        <AdminBilingualField
          labelText="Описание"
          enValue={lesson.note ?? ""}
          ruValue={lesson.note_ru ?? ""}
          onSaveEn={(v) => save({ note: v })}
          onSaveRu={(v) => save({ note_ru: v })}
        />
      </div>
      <button onClick={onDelete} className="text-xs shrink-0 px-3 py-[7px]" style={{ color: colors.danger }}>
        Удалить
      </button>
    </div>
  );
}

function FaqRow({
  faq,
  onChange,
  onDelete,
}: {
  faq: AcademyFaq;
  onChange: (faq: AcademyFaq) => void;
  onDelete: () => void;
}) {
  const { token } = useAuth();

  async function save(patch: { question?: string; answer?: string; question_ru?: string; answer_ru?: string }) {
    if (!token) return;
    const updated = await updateFaq(token, faq.id, patch);
    onChange(updated);
  }

  return (
    <div className="flex gap-3 items-start border rounded-[8px] p-3" style={{ borderColor: colors.hairline }}>
      <div className="flex-1 flex flex-col gap-2.5">
        <AdminBilingualField
          labelText="Вопрос"
          enValue={faq.question}
          ruValue={faq.question_ru ?? ""}
          onSaveEn={(v) => save({ question: v })}
          onSaveRu={(v) => save({ question_ru: v })}
        />
        <AdminBilingualField
          labelText="Ответ"
          enValue={faq.answer ?? ""}
          ruValue={faq.answer_ru ?? ""}
          onSaveEn={(v) => save({ answer: v })}
          onSaveRu={(v) => save({ answer_ru: v })}
          multiline
        />
      </div>
      <button onClick={onDelete} className="text-xs shrink-0 px-3 py-[7px]" style={{ color: colors.danger }}>
        Удалить
      </button>
    </div>
  );
}

export default function AdminAcademyPage() {
  const { token } = useAuth();
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [faqs, setFaqs] = useState<AcademyFaq[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAdminLessons(token), getAdminFaqs(token), getAdminSettings(token)])
      .then(([l, f, s]) => {
        setLessons(l);
        setFaqs(f);
        setSettings(s);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function saveSettings(patch: Partial<SiteSettings>) {
    if (!token) return;
    const updated = await updateAdminSettings(token, patch);
    setSettings(updated);
  }

  async function handleVideoChange(fileList: FileList | null) {
    if (!fileList || !fileList[0] || !token) return;
    setVideoError(null);
    setUploadingVideo(true);
    try {
      const updated = await uploadSettingsVideo(token, "academy", fileList[0]);
      setSettings(updated);
    } catch {
      setVideoError("Не удалось загрузить видео. Попробуйте файл меньшего размера.");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }

  async function handleResetVideo() {
    if (!token) return;
    const updated = await deleteSettingsVideo(token, "academy");
    setSettings(updated);
  }

  async function handleAboutImage(file: File) {
    if (!token) return;
    const updated = await uploadSettingsImage(token, "academy-about", file);
    setSettings(updated);
  }

  async function handleAboutImageRemove() {
    if (!token) return;
    const updated = await deleteSettingsImage(token, "academy-about");
    setSettings(updated);
  }

  async function handleAddLesson() {
    if (!token) return;
    const lesson = await createLesson(token, { title: "Новый урок", note: "" });
    setLessons((prev) => [...prev, lesson]);
  }

  async function handleDeleteLesson(id: number) {
    if (!token) return;
    await deleteLesson(token, id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleAddFaq() {
    if (!token) return;
    const faq = await createFaq(token, { question: "Новый вопрос", answer: "" });
    setFaqs((prev) => [...prev, faq]);
  }

  async function handleDeleteFaq(id: number) {
    if (!token) return;
    await deleteFaq(token, id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  if (loading || !settings)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Академия</div>
      <div className="text-sm mb-7" style={{ color: colors.text }}>
        Видео, программа и вопросы академии.
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Видео на главной
        </div>
        <div className="flex gap-5 items-start flex-wrap">
          <video
            src={settings.academy_hero_video_url ? assetUrl(settings.academy_hero_video_url) : undefined}
            poster={settings.academy_hero_poster_url ? assetUrl(settings.academy_hero_poster_url) : undefined}
            muted
            controls={!!settings.academy_hero_video_url}
            className="w-[220px] aspect-video rounded-[8px] bg-black object-cover"
          />
          <div className="flex flex-col gap-2.5">
            <label className={`${primaryBtn} w-fit cursor-pointer`} style={primaryBtnStyle}>
              {uploadingVideo ? "Загрузка…" : "Загрузить новое видео"}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={uploadingVideo}
                onChange={(e) => handleVideoChange(e.target.files)}
              />
            </label>
            {settings.academy_hero_video_url && (
              <span onClick={handleResetVideo} className="text-xs cursor-pointer w-fit" style={{ color: colors.text }}>
                Удалить видео
              </span>
            )}
            <p className="text-[11px] max-w-[260px]" style={{ color: "#B0A5CC" }}>
              MP4/WebM/MOV, до 100 МБ. Не связано с видео на главной странице.
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
          Шапка
        </div>
        <div className="flex flex-col gap-3">
          <AdminBilingualField
            labelText="Заголовок"
            enValue={settings.academy_headline ?? ""}
            ruValue={settings.academy_headline_ru ?? ""}
            onSaveEn={(v) => saveSettings({ academy_headline: v })}
            onSaveRu={(v) => saveSettings({ academy_headline_ru: v })}
          />
          <AdminBilingualField
            labelText="Текст (используйте {city} для города)"
            enValue={settings.academy_subheadline ?? ""}
            ruValue={settings.academy_subheadline_ru ?? ""}
            onSaveEn={(v) => saveSettings({ academy_subheadline: v })}
            onSaveRu={(v) => saveSettings({ academy_subheadline_ru: v })}
            multiline
          />
        </div>
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className={sectionLabel} style={sectionLabelStyle}>
          Об академии
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <AdminBilingualField
            labelText="Заголовок"
            enValue={settings.academy_about_title ?? ""}
            ruValue={settings.academy_about_title_ru ?? ""}
            onSaveEn={(v) => saveSettings({ academy_about_title: v })}
            onSaveRu={(v) => saveSettings({ academy_about_title_ru: v })}
          />
          <AdminBilingualField
            labelText="Абзац 1 (используйте {name} для названия агентства)"
            enValue={settings.academy_about_body1 ?? ""}
            ruValue={settings.academy_about_body1_ru ?? ""}
            onSaveEn={(v) => saveSettings({ academy_about_body1: v })}
            onSaveRu={(v) => saveSettings({ academy_about_body1_ru: v })}
            multiline
          />
          <AdminBilingualField
            labelText="Абзац 2"
            enValue={settings.academy_about_body2 ?? ""}
            ruValue={settings.academy_about_body2_ru ?? ""}
            onSaveEn={(v) => saveSettings({ academy_about_body2: v })}
            onSaveRu={(v) => saveSettings({ academy_about_body2_ru: v })}
            multiline
          />
          <div className="flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Изображение раздела
            </label>
            <div className="w-48">
              <AdminPhotoSlot
                url={settings.academy_about_image_url}
                label="Перетащите изображение"
                onUpload={handleAboutImage}
                onRemove={settings.academy_about_image_url ? handleAboutImageRemove : undefined}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Недель
            </label>
            <input
              defaultValue={settings.academy_weeks ?? ""}
              onBlur={(e) => saveSettings({ academy_weeks: e.target.value })}
              className={input}
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Занятий
            </label>
            <input
              defaultValue={settings.academy_sessions ?? ""}
              onBlur={(e) => saveSettings({ academy_sessions: e.target.value })}
              className={input}
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} style={labelStyle}>
              Мест в потоке
            </label>
            <input
              defaultValue={settings.academy_cohort ?? ""}
              onBlur={(e) => saveSettings({ academy_cohort: e.target.value })}
              className={input}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div className={`${card} p-[22px] mb-5`} style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className={sectionLabel} style={{ ...sectionLabelStyle, marginBottom: 0 }}>
            Уроки программы
          </div>
          <button
            onClick={handleAddLesson}
            className="px-3 py-1.5 border rounded-[6px] text-xs cursor-pointer"
            style={{ borderColor: colors.inputBorder }}
          >
            + Добавить урок
          </button>
        </div>
        <div className="flex flex-col gap-3.5">
          {lessons.length === 0 ? (
            <p className="text-sm" style={{ color: colors.text }}>
              Уроков пока нет.
            </p>
          ) : (
            lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                onChange={(updated) => setLessons((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))}
                onDelete={() => handleDeleteLesson(lesson.id)}
              />
            ))
          )}
        </div>
      </div>

      <div className={`${card} p-[22px]`} style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className={sectionLabel} style={{ ...sectionLabelStyle, marginBottom: 0 }}>
            Вопросы и ответы
          </div>
          <button
            onClick={handleAddFaq}
            className="px-3 py-1.5 border rounded-[6px] text-xs cursor-pointer"
            style={{ borderColor: colors.inputBorder }}
          >
            + Добавить вопрос
          </button>
        </div>
        <div className="flex flex-col gap-3.5">
          {faqs.length === 0 ? (
            <p className="text-sm" style={{ color: colors.text }}>
              Вопросов пока нет.
            </p>
          ) : (
            faqs.map((faq) => (
              <FaqRow
                key={faq.id}
                faq={faq}
                onChange={(updated) => setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))}
                onDelete={() => handleDeleteFaq(faq.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
