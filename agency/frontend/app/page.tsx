import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getEditorialAlbums, assetUrl } from "@/lib/api";
import HeroVideo from "@/components/HeroVideo";
import EditorialLightbox from "@/components/EditorialLightbox";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

export default async function HomePage() {
  const [settings, albums] = await Promise.all([
    getSiteSettings().catch(() => null),
    getEditorialAlbums().catch(() => []),
  ]);

  const city = settings?.brand_city || "Tashkent";

  const heroPreEn = settings?.hero_pre || dict.en.home.heroPreDefault;
  const heroEmEn = settings?.hero_em || dict.en.home.heroEmDefault;
  const heroPostEn = settings?.hero_post || dict.en.home.heroPostDefault;
  const heroBodyEn = settings?.hero_body || dict.en.home.heroBodyDefault;
  const heroEyebrowEn = settings?.hero_subheadline || dict.en.home.heroEyebrowDefault;

  const heroPreRu = settings?.hero_pre_ru || dict.ru.home.heroPreDefault;
  const heroEmRu = settings?.hero_em_ru || dict.ru.home.heroEmDefault;
  const heroPostRu = settings?.hero_post_ru || dict.ru.home.heroPostDefault;
  const heroBodyRu = settings?.hero_body_ru || dict.ru.home.heroBodyDefault;
  const heroEyebrowRu = settings?.hero_subheadline_ru || dict.ru.home.heroEyebrowDefault;

  const manifestoTitleEn = settings?.manifesto_title || dict.en.home.manifestoTitleDefault;
  const manifestoBody1En = settings?.manifesto_body1 || dict.en.home.manifestoBody1Default;
  const manifestoBody2En = (
    settings?.manifesto_body2 || dict.en.home.manifestoBody2Default(city)
  ).replace("{city}", city);

  const manifestoTitleRu = settings?.manifesto_title_ru || dict.ru.home.manifestoTitleDefault;
  const manifestoBody1Ru = settings?.manifesto_body1_ru || dict.ru.home.manifestoBody1Default;
  const manifestoBody2Ru = (
    settings?.manifesto_body2_ru || dict.ru.home.manifestoBody2Default(city)
  ).replace("{city}", city);

  return (
    <div>
      <HeroVideo
        videoUrl={settings?.hero_video_url ?? null}
        posterUrl={settings?.hero_poster_url}
        eyebrow={<Localized en={heroEyebrowEn} ru={heroEyebrowRu} />}
        headline={
          <Localized
            en={
              <>
                {heroPreEn} <em className="italic">{heroEmEn}</em> {heroPostEn}
              </>
            }
            ru={
              <>
                {heroPreRu} <em className="italic">{heroEmRu}</em> {heroPostRu}
              </>
            }
          />
        }
        body={<Localized en={heroBodyEn} ru={heroBodyRu} />}
      />

      {/* Editorial Stories */}
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,110px)] bg-bgAlt">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="eyebrow text-accent mb-3.5">
              <Localized en={dict.en.home.newestWork} ru={dict.ru.home.newestWork} />
            </p>
            <h2 className="font-display font-medium text-[clamp(38px,4.5vw,60px)] leading-none">
              <Localized en={dict.en.home.editorialStories} ru={dict.ru.home.editorialStories} />
            </h2>
          </div>
          <p className="eyebrow max-w-[30ch]">
            <Localized en={dict.en.home.recentShoots} ru={dict.ru.home.recentShoots} />
          </p>
        </div>

        {albums.length === 0 ? (
          <p className="text-inkSoft text-sm">
            <Localized en={dict.en.home.noStories} ru={dict.ru.home.noStories} />
          </p>
        ) : (
          <>
            <EditorialLightbox albums={albums} />
            <Link
              href="/models"
              className="inline-block mt-14 text-xs tracking-[0.16em] uppercase border-b border-ink pb-1"
            >
              <Localized en={dict.en.home.viewAllModels} ru={dict.ru.home.viewAllModels} />
            </Link>
          </>
        )}
      </section>

      {/* Manifesto */}
      <section className="grid md:grid-cols-[0.9fr_1.1fr] border-t border-hairline">
        <div className="relative min-h-[56vh] bg-placeholder">
          {settings?.manifesto_image_url && (
            <Image src={assetUrl(settings.manifesto_image_url)} alt="" fill sizes="45vw" className="object-cover" />
          )}
        </div>
        <div className="flex flex-col justify-center p-[clamp(48px,6vw,96px)]">
          <p className="eyebrow text-accent mb-5">
            <Localized en={dict.en.home.theAgency} ru={dict.ru.home.theAgency} />
          </p>
          <h2 className="font-display font-medium text-[clamp(32px,3.6vw,50px)] leading-[1.06] mb-6">
            <Localized en={manifestoTitleEn} ru={manifestoTitleRu} />
          </h2>
          <p className="font-light text-base leading-[1.8] text-inkSoft max-w-lg mb-4">
            <Localized en={manifestoBody1En} ru={manifestoBody1Ru} />
          </p>
          <p className="font-light text-base leading-[1.8] text-inkSoft max-w-lg mb-8">
            <Localized en={manifestoBody2En} ru={manifestoBody2Ru} />
          </p>
          <Link href="/about" className="w-fit text-xs tracking-[0.16em] uppercase border-b border-ink pb-1">
            <Localized en={dict.en.home.ourStory} ru={dict.ru.home.ourStory} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper text-center px-10 py-[clamp(72px,9vw,130px)]">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accentDeep mb-6">
          <Localized en={dict.en.home.openCall} ru={dict.ru.home.openCall} />
        </p>
        <h2 className="font-display font-medium text-[clamp(40px,6vw,84px)] leading-none max-w-[14ch] mx-auto mb-8">
          <Localized en={dict.en.home.thinkYouHaveIt} ru={dict.ru.home.thinkYouHaveIt} />
        </h2>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2.5 px-[34px] py-4 bg-paper text-ink text-[11px] eyebrow hover:bg-accent hover:text-paper transition-colors"
        >
          <Localized en={dict.en.home.becomeModelCta} ru={dict.ru.home.becomeModelCta} />
        </Link>
      </section>
    </div>
  );
}
