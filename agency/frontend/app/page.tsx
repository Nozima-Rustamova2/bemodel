import Link from "next/link";
import { getSiteSettings, getAcademy } from "@/lib/api";
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

      {/* CTA */}
      <section className="bg-panel text-ink text-center px-10 py-[clamp(72px,9vw,130px)]">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accent mb-6">
          <Localized en={dict.en.home.openCall} ru={dict.ru.home.openCall} />
        </p>
        <h2 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none max-w-[14ch] mx-auto mb-8">
          <Localized en={dict.en.home.thinkYouHaveIt} ru={dict.ru.home.thinkYouHaveIt} />
        </h2>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2.5 px-[34px] py-4 bg-ink text-paper text-[11px] eyebrow hover:bg-accent hover:text-paper transition-colors"
        >
          <Localized en={dict.en.home.becomeModelCta} ru={dict.ru.home.becomeModelCta} />
        </Link>
      </section>
    </div>
  );
}
