"use client";

import { useLanguage } from "@/lib/language";

export default function LanguagePicker() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase select-none">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={lang === "en" ? "text-ink" : "text-mutedLight hover:text-inkSoft transition-colors"}
      >
        EN
      </button>
      <span className="text-mutedLight">/</span>
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={lang === "ru" ? "text-ink" : "text-mutedLight hover:text-inkSoft transition-colors"}
      >
        RU
      </button>
    </div>
  );
}
