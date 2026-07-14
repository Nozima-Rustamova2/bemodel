import Link from "next/link";
import Image from "next/image";
import Localized from "@/components/Localized";

export default function Footer() {
  return (
    <footer className="bg-ink text-mutedLight">
      <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 px-6 md:px-12 pt-14 md:pt-20 pb-14 border-b border-paperText/[0.14]">
        <div>
          <div className="relative h-8 md:h-9 w-[150px] md:w-[170px] mb-4">
            <Image src="/logo-wordmark-light.png" alt="bemodel" fill className="object-contain object-left" />
          </div>
          <p className="text-sm leading-relaxed max-w-xs font-light">
            <Localized
              en="A boutique modeling agency representing women and new faces, based in Almaty and placed worldwide."
              ru="Бутик-агентство моделей, представляющее женщин и новые лица, базирующееся в Алматы и работающее по всему миру."
            />
          </p>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Explore" ru="Навигация" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/models?category=Model" className="hover:text-paperText transition-colors">
              <Localized en="Models" ru="Модели" />
            </Link>
            <Link href="/models?category=New+Faces" className="hover:text-paperText transition-colors">
              <Localized en="New Faces" ru="Новые лица" />
            </Link>
            <Link href="/about" className="hover:text-paperText transition-colors">
              <Localized en="About" ru="О нас" />
            </Link>
            <Link href="/academy" className="hover:text-paperText transition-colors">
              <Localized en="Academy" ru="Академия" />
            </Link>
            <Link href="/contact" className="hover:text-paperText transition-colors">
              <Localized en="Contact" ru="Контакты" />
            </Link>
            <Link href="/apply" className="hover:text-paperText transition-colors">
              <Localized en="Become a Model" ru="Стать моделью" />
            </Link>
          </div>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Contact" ru="Контакты" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span>scout@bemodel.agency</span>
            <span>+7 727 000 00 00</span>
            <span>
              <Localized en="Almaty, Kazakhstan" ru="Алматы, Казахстан" />
            </span>
          </div>
        </div>
        <div>
          <div className="eyebrow text-taupe mb-4">
            <Localized en="Social" ru="Соцсети" />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span>Instagram</span>
            <span>TikTok</span>
            <span>LinkedIn</span>
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
          <a href="/admin/login" className="hover:text-paperText transition-colors">
            <Localized en="Staff Login" ru="Вход для персонала" />
          </a>
        </div>
      </div>
    </footer>
  );
}
