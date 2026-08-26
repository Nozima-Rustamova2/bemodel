"use client";

import { useLanguage } from "@/lib/language";

export default function LanguagePicker({ overlay = false }: { overlay?: boolean }) {
  const { lang, setLang } = useLanguage();

  const active = overlay ? "text-paperText" : "text-ink";
  const idle = overlay
    ? "text-paperText/60 hover:text-paperText transition-colors"
    : "text-mutedLight hover:text-inkSoft transition-colors";

  return (
    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase select-none">
      <button type="button" onClick={() => setLang("en")} className={lang === "en" ? active : idle}>
        EN
      </button>
      <span className={overlay ? "text-paperText/60" : "text-mutedLight"}>/</span>
      <button type="button" onClick={() => setLang("ru")} className={lang === "ru" ? active : idle}>
        RU
      </button>
    </div>
  );
}
