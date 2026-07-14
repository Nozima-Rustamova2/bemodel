"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, Dict, Lang } from "./i18n";

const STORAGE_KEY = "bemodel_lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ru") setLangState(saved);
    } catch {}
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
