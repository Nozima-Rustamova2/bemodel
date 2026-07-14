"use client";

import { useLanguage } from "@/lib/language";

export default function Localized({ en, ru }: { en: React.ReactNode; ru: React.ReactNode }) {
  const { lang } = useLanguage();
  return <>{lang === "ru" ? ru : en}</>;
}
