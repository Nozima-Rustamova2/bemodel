"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";

export default function ContactPage() {
  const { t } = useLanguage();

  const details = [
    { label: t.contactShared.studio, value: t.contactShared.studioLocation, href: null },
    { label: t.contactShared.email, value: "bemodelagencyuz@gmail.com", href: "mailto:bemodelagencyuz@gmail.com" },
    { label: t.contactShared.phone, value: "+998 99 874 86 53", href: "tel:+998998748653" },
    {
      label: t.contactShared.instagram,
      value: "@bemodelagency",
      href: "https://www.instagram.com/bemodelagency/",
      external: true,
    },
    {
      label: t.contactShared.telegram,
      value: "@bemodelagencyuz",
      href: "https://t.me/bemodelagencyuz",
      external: true,
    },
  ];

  return (
    <div className="bg-panel text-inkSoft min-h-[80vh] px-[clamp(24px,6vw,90px)] py-[clamp(48px,7vw,110px)]">
      <p className="text-[11px] tracking-[0.28em] uppercase text-accent mb-6">
        {t.contactShared.getInTouchEyebrow}
      </p>
      <h2 className="font-display font-medium text-[clamp(36px,5vw,72px)] leading-[1.02] text-ink mb-8">
        {t.contact.heading}
      </h2>
      <p className="font-light text-base leading-[1.8] max-w-[52ch] mb-14">{t.contact.intro}</p>

      <div className="border-t border-ink/[0.16] pt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        {details.map((d) => (
          <div key={d.label}>
            <p className="eyebrow text-taupe mb-2">{d.label}</p>
            {d.href ? (
              <a
                href={d.href}
                {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-base text-ink hover:text-accent transition-colors break-words"
              >
                {d.value}
              </a>
            ) : (
              <p className="font-display text-xl text-ink">{d.value}</p>
            )}
          </div>
        ))}
      </div>

      <p className="font-light text-sm leading-[1.8] mt-16 max-w-[52ch]">
        {t.contact.joinInstead}{" "}
        <Link href="/apply" className="border-b border-accent text-ink hover:text-accent transition-colors">
          {t.contact.applyLink}
        </Link>
      </p>
    </div>
  );
}
