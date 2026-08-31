import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSiteSettings } from "@/lib/api";

// One family across the whole site — headings and body alike.
// Cyrillic is named explicitly: most of the site's copy is Russian, and leaving
// it to chance is how the headings end up in a system fallback.
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  // Loaded as the variable font rather than a fixed ladder of weights: the brand
  // strip headings sit at 280, which no static instance provides. One file
  // covers 100-900, so this is also fewer bytes than the four statics were.
});

export const metadata: Metadata = {
  title: "bemodel | Modeling Agency",
  description: "BEMODEL AGENCY LLC — a parent modeling agency with a large base of professional models.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched here rather than in the footer so the Реквизиты link is present in
  // the first render instead of appearing after a client fetch settles.
  const settings = await getSiteSettings().catch(() => null);

  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-body antialiased bg-paper text-ink">
        <SiteChrome legalEn={settings?.legal_details ?? null} legalRu={settings?.legal_details_ru ?? null}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
