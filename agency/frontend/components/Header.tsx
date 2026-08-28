"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Localized from "@/components/Localized";
import LanguagePicker from "@/components/LanguagePicker";

export default function Header({
  overlay = false,
  academy = false,
}: {
  overlay?: boolean;
  academy?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Transparent only while sitting over the hero video; once scrolled past it the
  // solid bar comes back so the nav stays legible over light page content.
  const clear = overlay && !scrolled;

  return (
    <header
      className={`${overlay ? "fixed inset-x-0" : "sticky"} top-0 z-50 transition-colors duration-300 ${
        clear
          ? // Not a bar - a soft scrim so the nav stays legible over bright footage
            // while the video still reads through it.
            "bg-[linear-gradient(to_bottom,rgba(20,16,26,0.55),rgba(20,16,26,0.18)_60%,transparent)]"
          : "bg-panel"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-5">
        {/* The wordmark always goes home, so "Academy" sits outside the link
            rather than inside it. */}
        <div className="flex items-center gap-2 md:gap-2.5">
          <Link href="/" className="relative h-6 md:h-7 w-[110px] md:w-[130px] shrink-0">
            <Image
              src={clear ? "/logo-wordmark-light.png" : "/logo-wordmark.png"}
              alt="bemodel"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          {academy && (
            <span
              className={`uppercase leading-none ${clear ? "text-paperText" : "text-ink"}`}
              // Sized and tracked by eye against the wordmark artwork, which is a
              // PNG and so can't simply share a class with it.
              style={{
                fontWeight: 200,
                fontSize: "clamp(13px, 1.05vw, 16px)",
                letterSpacing: "0.26em",
                ...(clear ? { textShadow: "0 1px 14px rgba(0,0,0,0.85)" } : {}),
              }}
            >
              <Localized en="Academy" ru="Академия" />
            </span>
          )}
        </div>
        <div
          className={`flex items-center gap-6 md:gap-9 ${clear ? "text-paperText" : ""}`}
          style={clear ? { textShadow: "0 1px 14px rgba(0,0,0,0.85)" } : undefined}
        >
          {/* Models / New Faces / Bemodel Academy live in the homepage hero stack,
              so the top nav does not repeat them. */}
          {/* .eyebrow dropped here for the same reason as the button below: it
              forced a taupe colour that washed out against the lavender header. */}
          <nav className="hidden md:flex items-center gap-9 text-[11px] font-medium uppercase tracking-[0.2em]">
            <Link
              href="/contact"
              className={`transition-colors ${clear ? "hover:text-accentDeep" : "text-ink hover:text-accent"}`}
            >
              <Localized en="Contact" ru="Контакты" />
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            <LanguagePicker overlay={clear} />
            <Link
              href="/apply"
              // Not using the .eyebrow class here: it hard-sets a taupe colour that
              // beat the text utility and left the button barely legible on the
              // lavender header. Spelled out instead, and filled rather than
              // outlined once the header has a background behind it.
              className={`border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                clear
                  ? "border-paperText text-paperText hover:bg-paperText hover:text-ink"
                  : "border-ink bg-ink text-paper hover:bg-accent hover:border-accent"
              }`}
            >
              <Localized en="Become a Model" ru="Стать моделью" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
