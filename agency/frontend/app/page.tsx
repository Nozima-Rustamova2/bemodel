import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getAcademy, assetUrl } from "@/lib/api";
import { aboutCopy } from "@/lib/aboutCopy";
import HeroVideo from "@/components/HeroVideo";
import BrandMarquee from "@/components/BrandMarquee";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

export default async function HomePage() {
  // Same brand list the academy strip runs on — one place to upload them.
  const [settings, academy] = await Promise.all([
    getSiteSettings().catch(() => null),
    getAcademy().catch(() => ({ lessons: [], brands: [] })),
  ]);

  const about = aboutCopy(settings);

  return (
    <div>
      <HeroVideo
        videoUrl={settings?.hero_video_url ?? null}
        posterUrl={settings?.hero_poster_url}
        minHeightClass="min-h-screen"
        align="items-center"
        contentStyle={{ marginTop: "14vh" }}
      >
        <div className="flex flex-col">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/models?category=Model", en: dict.en.home.heroModels, ru: dict.ru.home.heroModels },
              {
                href: "/models?category=New+Faces",
                en: dict.en.home.heroNewFaces,
                ru: dict.ru.home.heroNewFaces,
              },
              { href: "/academy", en: dict.en.home.heroAcademy, ru: dict.ru.home.heroAcademy },
              { href: "/about", en: dict.en.home.heroAbout, ru: dict.ru.home.heroAbout },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit font-medium uppercase tracking-[0.06em] leading-[1.15] text-[clamp(19px,2.1vw,30px)] text-paperText/[0.88] hover:text-accentDeep transition-colors"
                style={{ textShadow: "0 2px 30px rgba(0,0,0,0.55)" }}
              >
                <Localized en={item.en} ru={item.ru} />
              </Link>
            ))}
          </nav>
        </div>
      </HeroVideo>

      {academy.brands.length > 0 && (
        <section className="bg-bgAlt border-b border-hairline py-[clamp(40px,5vw,68px)]">
          <h2 className="text-center font-display uppercase tracking-[0.04em] text-[clamp(18px,1.9vw,28px)] leading-none mb-[clamp(26px,3vw,42px)] px-6"
            style={{ fontWeight: 280 }}>
            <Localized en={dict.en.home.brandsHeading} ru={dict.ru.home.brandsHeading} />
          </h2>
          <BrandMarquee brands={academy.brands} />
        </section>
      )}

      {/* About, in short. Same copy as the About page — edited once in the admin
          panel — trimmed to the heading and opening paragraph, with the rest a
          click away. */}
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,120px)] border-b border-hairline">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[15px] font-medium tracking-[0.24em] uppercase text-accent mb-6">
            <Localized en={`About ${about.name}`} ru={dict.ru.about.aboutOf(about.name)} />
          </p>
          <h2 className="font-display font-light text-[clamp(24px,2.7vw,38px)] leading-[1.12] mb-7">
            <Localized en={about.headingEn} ru={about.headingRu} />
          </h2>
          <p className="font-light text-lg leading-[1.85] text-inkSofter mb-5">
            <Localized en={about.body1En} ru={about.body1Ru} />
          </p>
          <p className="font-light text-lg leading-[1.85] text-inkSofter mb-9">
            <Localized en={about.body2En} ru={about.body2Ru} />
          </p>
          <Link
            href="/about"
            className="text-[11px] tracking-[0.18em] uppercase text-ink border-b border-ink/30 pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            <Localized en={dict.en.home.moreAboutUs} ru={dict.ru.home.moreAboutUs} />
          </Link>
        </div>
      </section>

      {/* Open call. The photo is the whole band; without one it falls back to the
          lavender panel so the section never turns up empty. */}
      <section className="relative overflow-hidden bg-panel flex flex-col items-center justify-between text-center px-10 min-h-[clamp(430px,50vw,680px)] py-[clamp(38px,4.5vw,66px)]">
        {settings?.cta_image_url && (
          <>
            <Image
              src={assetUrl(settings.cta_image_url)}
              alt=""
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
            {/* Inline scrim: a band that silently lost its overlay would leave the
                eyebrow and button unreadable over a bright photo. */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(20, 16, 26, 0.42)" }}
            />
          </>
        )}

        <p
          className={`relative z-[1] text-[11px] tracking-[0.28em] uppercase ${
            settings?.cta_image_url ? "text-paperText" : "text-accent"
          }`}
          style={settings?.cta_image_url ? { textShadow: "0 1px 18px rgba(0,0,0,0.5)" } : undefined}
        >
          <Localized en={dict.en.home.openCall} ru={dict.ru.home.openCall} />
        </p>

        <Link
          href="/apply"
          className={`relative z-[1] inline-flex items-center gap-2.5 px-[34px] py-4 text-[11px] eyebrow transition-colors ${
            settings?.cta_image_url
              ? "bg-paperText text-ink hover:bg-accent hover:text-paperText"
              : "bg-ink text-paper hover:bg-accent hover:text-paper"
          }`}
        >
          <Localized en={dict.en.home.becomeModelCta} ru={dict.ru.home.becomeModelCta} />
        </Link>
      </section>
    </div>
  );
}
