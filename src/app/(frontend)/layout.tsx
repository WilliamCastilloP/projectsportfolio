import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Playfair_Display } from "next/font/google";
import { getLocale } from "next-intl/server";
import { languageAlternates } from "@/i18n/path";
import { getSettings } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const description = settings.tagline || settings.hero?.intro || "";

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings.name,
      template: `%s — ${settings.name}`,
    },
    description,
    applicationName: settings.name,
    icons: {
      icon: [
        { url: "/brand/favicon.png?v=4", type: "image/png", sizes: "32x32" },
        { url: "/brand/favicon-192.png?v=4", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/brand/apple-touch-icon.png?v=4", sizes: "180x180" }],
    },
    alternates: {
      canonical: locale === "es" ? "/" : `/${locale}`,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : locale === "en" ? "en_US" : "es_ES",
      url: settings.url,
      siteName: settings.name,
      title: settings.name,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#faf8f5",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    email: `mailto:${settings.email}`,
    sameAs: settings.socials.map((s) => s.href),
  };

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
