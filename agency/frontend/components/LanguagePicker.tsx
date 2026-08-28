"use client";

import { useLanguage } from "@/lib/language";

export default function LanguagePicker({ overlay = false }: { overlay?: boolean }) {
  const { lang, setLang } = useLanguage();

  const active = overlay ? "text-paperText" : "text-ink";
  // The idle language used to be mutedLight, which all but vanished against the
  // lavender header. inkSoft keeps the active/idle distinction readable.
  const idle = overlay
    ? "text-paperText/70 hover:text-paperText transition-colors"
    : "text-inkSoft hover:text-ink transition-colors";

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.18em] uppercase select-none">
      <button type="button" onClick={() => setLang("en")} className={lang === "en" ? active : idle}>
        EN
      </button>
      <span className={overlay ? "text-paperText/60" : "text-taupe"}>/</span>
      <button type="button" onClick={() => setLang("ru")} className={lang === "ru" ? active : idle}>
        RU
      </button>
    </div>
  );
}
