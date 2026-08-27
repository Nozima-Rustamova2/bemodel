import { getSiteSettings } from "@/lib/api";
import Localized from "@/components/Localized";
import { aboutCopy } from "@/lib/aboutCopy";
import { dict } from "@/lib/i18n";

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);
  const { name, headingEn, headingRu, body1En, body1Ru, body2En, body2Ru } = aboutCopy(settings);

  return (
    <div>
      {/* Same treatment as the homepage summary this page expands on. */}
      <section className="px-6 md:px-24 py-[clamp(64px,8vw,120px)]">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[15px] font-medium tracking-[0.24em] uppercase text-accent mb-6">
            <Localized en={`About ${name}`} ru={dict.ru.about.aboutOf(name)} />
          </p>
          <h1 className="font-display font-light text-[clamp(24px,2.7vw,38px)] leading-[1.12] mb-7">
            <Localized en={headingEn} ru={headingRu} />
          </h1>
          <p className="font-light text-lg leading-[1.85] text-inkSofter mb-5">
            <Localized en={body1En} ru={body1Ru} />
          </p>
          <p className="font-light text-lg leading-[1.85] text-inkSofter">
            <Localized en={body2En} ru={body2Ru} />
          </p>
        </div>
      </section>
    </div>
  );
}
