import Link from "next/link";
import Image from "next/image";
import Localized from "@/components/Localized";
import LanguagePicker from "@/components/LanguagePicker";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper/[0.82] backdrop-blur-md border-b border-hairline">
      <div className="flex items-center justify-between px-6 md:px-12 py-5">
        <Link href="/" className="relative h-6 md:h-7 w-[110px] md:w-[130px]">
          <Image src="/logo-wordmark.png" alt="bemodel" fill className="object-contain object-left" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-9 eyebrow">
          <Link href="/models?category=Model" className="hover:text-accent transition-colors">
            <Localized en="Models" ru="Модели" />
          </Link>
          <Link href="/models?category=New+Faces" className="hover:text-accent transition-colors">
            <Localized en="New Faces" ru="Новые лица" />
          </Link>
          <Link href="/academy" className="hover:text-accent transition-colors">
            <Localized en="Academy" ru="Академия" />
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            <Localized en="Contact" ru="Контакты" />
          </Link>
        </nav>
        <div className="flex items-center gap-5">
          <LanguagePicker />
          <Link
            href="/apply"
            className="border border-ink px-5 py-2.5 text-[10px] eyebrow hover:bg-ink hover:text-paper transition-colors"
          >
            <Localized en="Become a Model" ru="Стать моделью" />
          </Link>
        </div>
      </div>
    </header>
  );
}
