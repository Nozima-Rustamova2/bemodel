"use client";

import { useState } from "react";
import Link from "next/link";
import { submitScouting } from "@/lib/api";
import { useLanguage } from "@/lib/language";

const inputClass =
  "w-full py-3 border-0 border-b border-ink/[0.28] bg-transparent font-body text-[15px] text-ink outline-none focus:border-accent";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitScouting({ name, email, message }, []);
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
          {t.contact.heading}
        </h2>
        <p className="font-light text-base leading-[1.8] max-w-[38ch] mb-11">{t.contact.intro}</p>
        <div className="border-t border-paperText/[0.16] pt-6 space-y-6">
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.studio}</p>
            <p className="font-display text-xl text-paper">{t.contactShared.studioLocation}</p>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.email}</p>
            <p className="text-base text-paper">scout@bemodel.agency</p>
          </div>
          <div>
            <p className="eyebrow text-taupe mb-2">{t.contactShared.instagram}</p>
            <p className="text-base text-paper">@bemodel.agency</p>
          </div>
        </div>
        <p className="font-light text-sm leading-[1.8] mt-11 max-w-[38ch]">
          {t.contact.joinInstead}{" "}
          <Link href="/apply" className="border-b border-accentDeep text-paper hover:text-accentDeep transition-colors">
            {t.contact.applyLink}
          </Link>
        </p>
      </div>

      <div className="p-[clamp(48px,6vw,90px)] bg-bgAlt">
        {submitted ? (
          <div className="min-h-[50vh] flex flex-col justify-center animate-fade-up">
            <p className="eyebrow text-accent mb-5">{t.contactShared.received}</p>
            <h2 className="font-display font-medium text-[clamp(36px,4vw,58px)] leading-[1.05] mb-5">
              {t.contact.thankYouTitle}
            </h2>
            <p className="font-light text-base leading-[1.8] text-inkSoft max-w-[44ch] mb-8">
              {t.contact.thankYouBody}
            </p>
            <Link href="/" className="w-fit text-xs tracking-[0.16em] uppercase border-b border-ink pb-1">
              {t.contactShared.backToHome}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg">
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contactShared.fullName}</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.contact.namePlaceholder}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contactShared.email}</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-taupe">{t.contact.messageLabel}</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            {error && <p className="text-accent text-sm mt-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-10 inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-paper text-[11px] eyebrow hover:bg-accent transition-colors disabled:opacity-50"
            >
              {submitting ? t.contact.sending : t.contact.sendMessage}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
