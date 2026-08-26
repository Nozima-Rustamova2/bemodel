"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/language";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  // Only the pages that open on a full-bleed hero video can carry a transparent
  // header; every other route has a light background the nav would vanish into.
  const overlay = pathname === "/" || pathname === "/academy";

  return (
    <LanguageProvider>
      <Header overlay={overlay} academy={pathname === "/academy"} />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
