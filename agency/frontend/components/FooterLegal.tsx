"use client";

import { useEffect, useState } from "react";
import Localized from "@/components/Localized";
import { useLanguage } from "@/lib/language";
import { dict } from "@/lib/i18n";

/**
 * The footer's "Реквизиты" panel: company registration details, tucked behind a
 * link rather than printed across the footer, since almost no visitor needs them
 * but the ones who do expect to find them at the bottom of the page.
 *
 * Renders nothing at all when no details have been entered, so the link never
 * opens an empty panel.
 */
export default function FooterLegal({ en, ru }: { en: string | null; ru: string | null }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  // Falls back to the registered details in the dictionary, so the panel is
  // correct out of the box; anything entered in the admin panel overrides it.
  const stored = lang === "ru" ? ru || en : en || ru;
  const text = (stored || dict[lang].legal.detailsDefault).trim();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!text) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-ink transition-colors"
      >
        <Localized en={dict.en.legal.heading} ru={dict.ru.legal.heading} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          // Inline: a scrim that silently failed to paint would leave the panel
          // floating over live page content.
          style={{ backgroundColor: "rgba(18, 14, 24, 0.6)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-paper text-ink w-full max-w-[560px] max-h-[80vh] overflow-y-auto p-[clamp(26px,4vw,44px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-4 text-inkSoft hover:text-ink transition-colors text-2xl leading-none p-1"
            >
              ×
            </button>
            <h2 className="font-display font-light text-[clamp(24px,2.7vw,34px)] leading-tight mb-6">
              <Localized en={dict.en.legal.heading} ru={dict.ru.legal.heading} />
            </h2>
            <p className="text-sm leading-[1.8] text-inkSofter whitespace-pre-line">{text}</p>
          </div>
        </div>
      )}
    </>
  );
}
