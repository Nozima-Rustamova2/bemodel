import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getAcademy, assetUrl, SiteSettings } from "@/lib/api";
import HeroVideo from "@/components/HeroVideo";
import BrandMarquee from "@/components/BrandMarquee";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

export default async function AcademyPage() {
  const [settings, academy] = await Promise.all([
    getSiteSettings().catch(() => null as SiteSettings | null),
    getAcademy().catch(() => ({ lessons: [], brands: [] })),
  ]);

  const name = settings?.brand_name || "bemodel";

  const aboutTitleEn = settings?.academy_about_title || dict.en.academy.aboutHeadingDefault;
  const aboutBody1En = (
    settings?.academy_about_body1 || dict.en.academy.aboutBody1Default(name)
  ).replace("{name}", name);
  const aboutBody2En = settings?.academy_about_body2 || dict.en.academy.aboutBody2Default;

  const aboutTitleRu = settings?.academy_about_title_ru || dict.ru.academy.aboutHeadingDefault;
  const aboutBody1Ru = (
    settings?.academy_about_body1_ru || dict.ru.academy.aboutBody1Default(name)
  ).replace("{name}", name);
  const aboutBody2Ru = settings?.academy_about_body2_ru || dict.ru.academy.aboutBody2Default;

  const STATS_EN = [
    { value: settings?.academy_weeks || "8", label: dict.en.academy.weeks },
    { value: settings?.academy_sessions || "16", label: dict.en.academy.sessions },
    { value: settings?.academy_cohort || "12", label: dict.en.academy.perCohort },
  ];
  const STATS_RU = [
    { value: settings?.academy_weeks || "8", label: dict.ru.academy.weeks },
    { value: settings?.academy_sessions || "16", label: dict.ru.academy.sessions },
    { value: settings?.academy_cohort || "12", label: dict.ru.academy.perCohort },
  ];

  return (
    <div>
      <HeroVideo
        videoUrl={settings?.academy_hero_video_url ?? settings?.hero_video_url ?? null}
        posterUrl={settings?.academy_hero_poster_url ?? settings?.hero_poster_url}
        minHeightClass="min-h-[78vh]"
        overlay="bg-[linear-gradient(to_top,rgba(24,20,16,0.78),rgba(24,20,16,0.25)_50%,rgba(24,20,16,0.35))]"
      >
        <Link
          href="/apply"
          className="inline-flex items-center gap-2.5 px-7 py-[15px] bg-paperText text-ink text-[11px] eyebrow hover:bg-accent hover:text-paperText transition-colors"
        >
          <Localized en={dict.en.academy.applyToAcademy} ru={dict.ru.academy.applyToAcademy} />
        </Link>
      </HeroVideo>

      {/* Where our graduates work */}
      {academy.brands.length > 0 && (
        <section className="bg-bgAlt border-b border-hairline py-[clamp(40px,5vw,68px)]">
          <h2 className="text-center font-display font-medium text-[clamp(22px,2.4vw,32px)] leading-none mb-[clamp(26px,3vw,42px)] px-6">
            <Localized en={dict.en.academy.brandsHeading} ru={dict.ru.academy.brandsHeading} />
          </h2>
          <BrandMarquee brands={academy.brands} />
        </section>
      )}

      {/* About the academy */}
      <section className="grid md:grid-cols-[1.05fr_0.95fr] bg-bgAlt border-b border-hairline">
        <div className="flex flex-col justify-center p-[clamp(48px,6vw,96px)]">
          <p className="eyebrow text-accent mb-5">
            <Localized en={dict.en.academy.aboutTitleEyebrow} ru={dict.ru.academy.aboutTitleEyebrow} />
          </p>
          <h2 className="font-display font-medium text-[clamp(32px,3.8vw,52px)] leading-[1.06] mb-6">
            <Localized en={aboutTitleEn} ru={aboutTitleRu} />
          </h2>
          <p className="font-light text-base leading-[1.8] text-inkSoft max-w-lg mb-4">
            <Localized en={aboutBody1En} ru={aboutBody1Ru} />
          </p>
          <p className="font-light text-base leading-[1.8] text-inkSoft max-w-lg mb-9">
            <Localized en={aboutBody2En} ru={aboutBody2Ru} />
          </p>
          <div className="flex gap-11 flex-wrap">
            {STATS_EN.map((s, i) => (
              <div key={s.label}>
                <div className="font-display text-[44px] text-accent leading-none">{s.value}</div>
                <div className="eyebrow mt-1.5">
                  <Localized en={s.label} ru={STATS_RU[i].label} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[54vh] bg-placeholder">
          {settings?.academy_about_image_url && (
            <Image src={assetUrl(settings.academy_about_image_url)} alt="" fill sizes="45vw" className="object-cover" />
          )}
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,110px)]">
        <div className="mb-12">
          <p className="eyebrow text-accent mb-3.5">
            <Localized en={dict.en.academy.curriculumEyebrow} ru={dict.ru.academy.curriculumEyebrow} />
          </p>
          <h2 className="font-display font-medium text-[clamp(34px,4.2vw,58px)] leading-none">
            <Localized en={dict.en.academy.insideLessons} ru={dict.ru.academy.insideLessons} />
          </h2>
        </div>
        {academy.lessons.length === 0 ? (
          <p className="text-inkSoft text-sm">
            <Localized en={dict.en.academy.curriculumComingSoon} ru={dict.ru.academy.curriculumComingSoon} />
          </p>
        ) : (
          <div
            className="grid gap-x-[26px] gap-y-[34px]"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {academy.lessons.map((lesson) => (
              <div key={lesson.id} className="flex flex-col gap-3.5">
                <div className="relative aspect-[4/3] bg-placeholder overflow-hidden">
                  {lesson.image_url && (
                    <Image src={assetUrl(lesson.image_url)} alt={lesson.title} fill sizes="30vw" className="object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-medium text-[23px] mb-1.5">
                    <Localized en={lesson.title} ru={lesson.title_ru || lesson.title} />
                  </h3>
                  {lesson.note && (
                    <p className="font-light text-sm leading-[1.65] text-inkSoft">
                      <Localized en={lesson.note} ru={lesson.note_ru || lesson.note} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
