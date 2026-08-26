import Link from "next/link";
import Image from "next/image";
import Localized from "@/components/Localized";

export default function Footer() {
  return (
    <footer className="bg-panel text-inkSoft">
      <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 px-6 md:px-12 pt-14 md:pt-20 pb-14 border-b border-ink/[0.14]">
        <div>
          <div className="relative h-8 md:h-9 w-[150px] md:w-[170px] mb-4">
            <Image src="/logo-wordmark.png" alt="bemodel" fill className="object-contain object-left" />
          </div>
          <p className="text-sm leading-relaxed max-w-xs font-light">
            <Localized
              en="A boutique modeling agency representing women and new faces, based in Tashkent and placed worldwide."
              ru="Бутик-агентство моделей, представляющее женщин и новые лица, базирующееся в Ташкенте и работающее по всему миру."
            />
          </p>
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
      <div className="flex justify-between flex-wrap gap-3 px-6 md:px-12 py-6 text-[11px] text-taupe">
        <span>
          <Localized
            en={`© ${new Date().getFullYear()} bemodel — All rights reserved`}
            ru={`© ${new Date().getFullYear()} bemodel — Все права защищены`}
          />
        </span>
        <div className="flex gap-4">
          <span>
            <Localized en="Terms · Privacy · Model Rights" ru="Условия · Конфиденциальность · Права моделей" />
          </span>
          <a href="/admin/login" className="hover:text-ink transition-colors">
            <Localized en="Staff Login" ru="Вход для персонала" />
          </a>
        </div>
      </div>
    </footer>
  );
}
