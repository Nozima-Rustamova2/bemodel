import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "bemodel | Modeling Agency",
  description: "A boutique modeling agency representing women and new faces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body antialiased bg-paper text-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
