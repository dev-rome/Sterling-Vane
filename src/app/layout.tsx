import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sterling & Vane · Gentlemen’s Barbers in Chicago’s West Loop",
    template: "%s | Sterling & Vane",
  },
  description:
    "Premium cuts, hot towel shaves and beard work in Chicago’s West Loop since 2014. Meet our barbers and book your chair online.",
  applicationName: "Sterling & Vane",
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
  openGraph: {
    type: "website",
    siteName: "Sterling & Vane",
    locale: "en_US",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-espresso font-sans font-light text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
