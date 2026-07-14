import { getSiteSettings } from "@/lib/api";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

const DEFAULT_STEPS = [
  { title: dict.en.about.step1TitleDefault, note: dict.en.about.step1BodyDefault },
  { title: dict.en.about.step2TitleDefault, note: dict.en.about.step2BodyDefault },
  { title: dict.en.about.step3TitleDefault, note: dict.en.about.step3BodyDefault },
];

const RU_STEPS = [
  { title: dict.ru.about.step1TitleDefault, note: dict.ru.about.step1BodyDefault },
  { title: dict.ru.about.step2TitleDefault, note: dict.ru.about.step2BodyDefault },
  { title: dict.ru.about.step3TitleDefault, note: dict.ru.about.step3BodyDefault },
];

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);
  const name = settings?.brand_name || "bemodel";
  const city = settings?.brand_city || "Almaty";

  const headingEn = settings?.about_heading || dict.en.about.headingDefault;
  const body1En = (
    settings?.about_body1 || dict.en.about.body1Default(name, city)
  )
    .replace("{name}", name)
    .replace("{city}", city);
  const body2En = settings?.about_body2 || dict.en.about.body2Default;

  const headingRu = settings?.about_heading_ru || dict.ru.about.headingDefault;
  const body1Ru = (
    settings?.about_body1_ru || dict.ru.about.body1Default(name, city)
  )
    .replace("{name}", name)
    .replace("{city}", city);
  const body2Ru = settings?.about_body2_ru || dict.ru.about.body2Default;

  const stepsEn = [
    { title: settings?.about_step1_title || DEFAULT_STEPS[0].title, note: settings?.about_step1_body || DEFAULT_STEPS[0].note },
    { title: settings?.about_step2_title || DEFAULT_STEPS[1].title, note: settings?.about_step2_body || DEFAULT_STEPS[1].note },
    { title: settings?.about_step3_title || DEFAULT_STEPS[2].title, note: settings?.about_step3_body || DEFAULT_STEPS[2].note },
  ];
  const stepsRu = [
    { title: settings?.about_step1_title_ru || RU_STEPS[0].title, note: settings?.about_step1_body_ru || RU_STEPS[0].note },
    { title: settings?.about_step2_title_ru || RU_STEPS[1].title, note: settings?.about_step2_body_ru || RU_STEPS[1].note },
    { title: settings?.about_step3_title_ru || RU_STEPS[2].title, note: settings?.about_step3_body_ru || RU_STEPS[2].note },
  ];

  return (
    <div>
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,120px)] max-w-[900px]">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accent mb-6">
          <Localized en={`About ${name}`} ru={dict.ru.about.aboutOf(name)} />
        </p>
        <h1 className="font-display font-medium text-[clamp(40px,5.5vw,80px)] leading-[1.02] mb-10">
          <Localized en={headingEn} ru={headingRu} />
        </h1>
        <p className="font-light text-lg leading-[1.85] text-inkSofter mb-5">
          <Localized en={body1En} ru={body1Ru} />
        </p>
        <p className="font-light text-lg leading-[1.85] text-inkSofter">
          <Localized en={body2En} ru={body2Ru} />
        </p>
      </section>

      <section className="grid md:grid-cols-3 border-t border-hairline">
        {stepsEn.map((step, i) => (
          <div
            key={step.title}
            className={`p-[clamp(40px,5vw,72px)_clamp(28px,3vw,48px)] ${
              i < stepsEn.length - 1 ? "md:border-r border-hairline" : ""
            }`}
          >
            <div className="font-display text-[56px] text-accent leading-none">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="font-display font-medium text-2xl mt-[18px] mb-3">
              <Localized en={step.title} ru={stepsRu[i].title} />
            </h3>
            <p className="font-light text-[15px] leading-[1.75] text-inkSoft">
              <Localized en={step.note} ru={stepsRu[i].note} />
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
