import Link from "next/link";
import Image from "next/image";
import Localized from "@/components/Localized";
import FooterLegal from "@/components/FooterLegal";

// Registration date of the agency, shown verbatim in the copyright line.
const FOUNDED = "02.02.2022";

// What the agency offers, kept as a list because the source copy is one: five
// items running together as a single comma-separated sentence are hard to scan
// in a footer column this narrow.
const OFFERINGS: { en: string; ru: string }[] = [
  {
    en: "professional training and career development in Uzbekistan and on the international market",
    ru: "профессиональное обучение и развитие карьеры в Узбекистане и на международном рынке",
  },
  {
    en: "castings, runway shows and shoots for leading brands",
    ru: "кастинги, показы и съёмки для ведущих брендов",
  },
  {
    en: "mentorship and promotion from the agency",
    ru: "наставничество и продвижение от агентства",
  },
  {
    en: "real opportunities for professional growth",
    ru: "реальные возможности профессионального роста",
  },
  {
    en: "the safety of our models",
    ru: "безопасность моделей",
  },
];

export default function Footer({
  legalEn = null,
  legalRu = null,
}: {
  legalEn?: string | null;
  legalRu?: string | null;
}) {
  return (
    <footer className="bg-panel text-inkSoft">
      <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 px-6 md:px-12 pt-14 md:pt-20 pb-14 border-b border-ink/[0.14]">
        <div>
          <div className="relative h-8 md:h-9 w-[150px] md:w-[170px] mb-4">
            <Image src="/logo-wordmark.png" alt="bemodel" fill className="object-contain object-left" />
          </div>
          <div className="max-w-sm text-sm leading-relaxed font-normal flex flex-col gap-3.5">
            <p>
              <Localized
                en={
                  <>
                    <span className="font-semibold text-ink">BEMODEL AGENCY</span> LLC — a parent
                    modeling agency with a large base of professional models.
                  </>
                }
                ru={
                  <>
                    ООО «<span className="font-semibold text-ink">BEMODEL AGENCY</span>» — материнское
                    модельное агентство с большой базой профессиональных моделей.
                  </>
                }
              />
            </p>
            <div>
              <p className="mb-2">
                <Localized
                  en={<><span className="font-semibold text-ink">BEMODEL</span> means:</>}
                  ru={<><span className="font-semibold text-ink">BEMODEL</span> — это:</>}
                />
              </p>
              <ul className="flex flex-col gap-1.5 pl-4 list-disc marker:text-taupe/70">
                {OFFERINGS.map((item) => (
                  <li key={item.en}>
                    <Localized en={item.en} ru={item.ru} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Explore" ru="Навигация" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/models?category=Model" className="hover:text-ink transition-colors">
              <Localized en="Models" ru="Модели" />
            </Link>
            <Link href="/models?category=New+Faces" className="hover:text-ink transition-colors">
              <Localized en="New Faces" ru="Новые лица" />
            </Link>
            <Link href="/about" className="hover:text-ink transition-colors">
              <Localized en="About" ru="О нас" />
            </Link>
            <Link href="/academy" className="hover:text-ink transition-colors">
              <Localized en="Bemodel Academy" ru="Академия Bemodel" />
            </Link>
            <Link href="/contact" className="hover:text-ink transition-colors">
              <Localized en="Contact" ru="Контакты" />
            </Link>
            <Link href="/apply" className="hover:text-ink transition-colors">
              <Localized en="Become a Model" ru="Стать моделью" />
            </Link>
          </div>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Contact" ru="Контакты" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <a href="mailto:bemodelagencyuz@gmail.com" className="hover:text-ink transition-colors">
              bemodelagencyuz@gmail.com
            </a>
            <a href="tel:+998998748653" className="hover:text-ink transition-colors">
              +998 99 874 86 53
            </a>
            <span>
              <Localized en="Tashkent, Uzbekistan" ru="Ташкент, Узбекистан" />
            </span>
          </div>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Social" ru="Соцсети" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href="https://www.instagram.com/bemodelagency/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://t.me/bemodelagencyuz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-3 px-6 md:px-12 py-7 text-[14px] text-taupe">
        <span>
          <Localized
            en={`${FOUNDED} © bemodel — All rights reserved`}
            ru={`${FOUNDED} © bemodel — Все права защищены`}
          />
        </span>
        <div className="flex gap-4">
          <FooterLegal en={legalEn} ru={legalRu} />
        </div>
      </div>
    </footer>
  );
}
