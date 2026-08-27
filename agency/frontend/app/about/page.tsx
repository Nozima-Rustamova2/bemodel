import { getSiteSettings } from "@/lib/api";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);
  const name = settings?.brand_name || "bemodel";
  const city = settings?.brand_city || "Tashkent";

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

  return (
    <div>
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,120px)] max-w-[900px]">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accent mb-6">
          <Localized en={`About ${name}`} ru={dict.ru.about.aboutOf(name)} />
        </p>
        <h1 className="font-display font-light text-[clamp(40px,5.5vw,80px)] leading-[1.02] mb-10">
          <Localized en={headingEn} ru={headingRu} />
        </h1>
        <p className="font-light text-lg leading-[1.85] text-inkSofter mb-5">
          <Localized en={body1En} ru={body1Ru} />
        </p>
        <p className="font-light text-lg leading-[1.85] text-inkSofter">
          <Localized en={body2En} ru={body2Ru} />
        </p>
      </section>
    </div>
  );
}
