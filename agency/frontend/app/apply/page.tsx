"use client";

import { useState } from "react";
import Link from "next/link";
import { submitScouting, ScoutingFormValues } from "@/lib/api";
import { useLanguage } from "@/lib/language";

const PHOTO_SLOTS = ["Portrait", "Full length", "Profile"] as const;

const emptyForm: ScoutingFormValues = {
  name: "",
  email: "",
  phone: "",
  instagram: "",
  city: "",
  birthdate: "",
  height: "",
  message: "",
  source: "apply",
};

const inputClass =
  "w-full py-3 border-0 border-b border-ink/[0.28] bg-transparent font-body text-[15px] text-ink outline-none focus:border-accent";

export default function ApplyPage() {
  const { t } = useLanguage();
  const PHOTO_SLOT_LABELS: Record<(typeof PHOTO_SLOTS)[number], string> = {
    Portrait: t.photoLabels.portrait,
    "Full length": t.photoLabels.fullLength,
    Profile: t.photoLabels.profile,
  };
  const [form, setForm] = useState<ScoutingFormValues>(emptyForm);
  const [photos, setPhotos] = useState<Record<(typeof PHOTO_SLOTS)[number], File | null>>({
    Portrait: null,
    "Full length": null,
    Profile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ScoutingFormValues>(key: K, value: ScoutingFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const files = PHOTO_SLOTS.map((slot) => photos[slot]).filter((f): f is File => !!f);
      await submitScouting(form, files);
      setSubmitted(true);
    } catch {
      setError(t.contactShared.somethingWrong);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[0.85fr_1.15fr] min-h-[80vh]">
      <div className="bg-ink text-mutedLight p-[clamp(48px,6vw,90px)]">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accentDeep mb-6">{t.contactShared.getInTouchEyebrow}</p>
        <h2 className="font-display font-medium text-[clamp(36px,4vw,58px)] leading-[1.02] text-paper mb-10">
          {t.apply.heading}
        </h2>
        <p className="font-light text-base leading-[1.8] max-w-[38ch] mb-11">{t.apply.intro}</p>
        <div className="border-t border-paperText/[0.16] pt-6 space-y-6">
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.studio}</p>
            <p className="font-display text-xl text-paper">{t.contactShared.studioLocation}</p>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.email}</p>
            <a href="mailto:bemodelagencyuz@gmail.com" className="text-base text-paper hover:text-accentDeep transition-colors">
              bemodelagencyuz@gmail.com
            </a>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.phone}</p>
            <a href="tel:+998998748653" className="text-base text-paper hover:text-accentDeep transition-colors">
              +998 99 874 86 53
            </a>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.instagram}</p>
            <a
              href="https://www.instagram.com/bemodelagency/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-paper hover:text-accentDeep transition-colors"
            >
              @bemodelagency
            </a>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.telegram}</p>
            <a
              href="https://t.me/bemodelagencyuz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-paper hover:text-accentDeep transition-colors"
            >
              @bemodelagencyuz
            </a>
          </div>
        </div>
      </div>

      <div className="p-[clamp(48px,6vw,90px)] bg-bgAlt">
        {submitted ? (
          <div className="min-h-[50vh] flex flex-col justify-center animate-fade-up">
            <p className="eyebrow text-accent mb-5">{t.contactShared.received}</p>
            <h2 className="font-display font-medium text-[clamp(36px,4vw,58px)] leading-[1.05] mb-5">
              {t.contact.thankYouTitle}
            </h2>
            <p className="font-light text-base leading-[1.8] text-inkSoft max-w-[44ch] mb-8">
              {t.apply.thankYouBody}
            </p>
            <Link href="/" className="w-fit text-xs tracking-[0.16em] uppercase border-b border-ink pb-1">
              {t.contactShared.backToHome}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-[30px]">
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contactShared.fullName}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Anastasiya K."
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contactShared.email}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.apply.phone}</label>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+998 __ ___ __ __"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contactShared.instagram}</label>
                <input
                  value={form.instagram}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="@handle"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.apply.cityCountry}</label>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Tashkent, UZ"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="eyebrow text-taupe">{t.apply.dob}</label>
                  <input
                    value={form.birthdate}
                    onChange={(e) => set("birthdate", e.target.value)}
                    placeholder="DD / MM / YYYY"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 w-[110px]">
                  <label className="eyebrow text-taupe">{t.apply.height}</label>
                  <input
                    value={form.height}
                    onChange={(e) => set("height", e.target.value)}
                    placeholder="cm"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-[30px]">
              <label className="eyebrow text-taupe">{t.apply.tellUsAboutYourself}</label>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={3}
                placeholder={t.apply.messagePlaceholder}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-[30px]">
              {PHOTO_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className="border border-dashed border-ink/30 p-[22px_14px] text-center mono-caption cursor-pointer hover:border-accent transition-colors block"
                >
                  {photos[slot] ? photos[slot]!.name.slice(0, 16) : `+ ${PHOTO_SLOT_LABELS[slot].toUpperCase()}`}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={(e) => setPhotos((prev) => ({ ...prev, [slot]: e.target.files?.[0] ?? null }))}
                  />
                </label>
              ))}
            </div>

            {error && <p className="text-accent text-sm mt-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-10 inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-paper text-[11px] eyebrow hover:bg-accent transition-colors disabled:opacity-50"
            >
              {submitting ? t.apply.submitting : t.apply.submitApplication}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
