import { SiteSettings } from "@/lib/api";
import { dict } from "@/lib/i18n";

/**
 * The About copy, resolved once for both the About page and the homepage
 * summary that links to it. Kept here so the two can never drift: the director
 * edits one set of fields in the admin panel and both places follow.
 *
 * Each field falls back to a bilingual default, and {name}/{city} placeholders
 * are filled in whether they came from the stored text or the default.
 */
export type AboutCopy = {
  name: string;
  headingEn: string;
  headingRu: string;
  body1En: string;
  body1Ru: string;
  body2En: string;
  body2Ru: string;
};

export function aboutCopy(settings: SiteSettings | null): AboutCopy {
  const name = settings?.brand_name || "bemodel";
  const city = settings?.brand_city || "Tashkent";

  const fill = (text: string) => text.replace("{name}", name).replace("{city}", city);

  return {
    name,
    headingEn: settings?.about_heading || dict.en.about.headingDefault,
    headingRu: settings?.about_heading_ru || dict.ru.about.headingDefault,
    body1En: fill(settings?.about_body1 || dict.en.about.body1Default(name, city)),
    body1Ru: fill(settings?.about_body1_ru || dict.ru.about.body1Default(name, city)),
    body2En: settings?.about_body2 || dict.en.about.body2Default,
    body2Ru: settings?.about_body2_ru || dict.ru.about.body2Default,
  };
}
