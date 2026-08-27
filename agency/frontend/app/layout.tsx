import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

// One family across the whole site — headings and body alike.
// Cyrillic is named explicitly: most of the site's copy is Russian, and leaving
// it to chance is how the headings end up in a system fallback.
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  // 200 matches the thin weight of the BEMODEL wordmark artwork; 300 carries the
  // large display headings, which read blunt in a geometric sans at 500.
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "bemodel | Modeling Agency",
  description: "A boutique modeling agency representing women and new faces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-body antialiased bg-paper text-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
