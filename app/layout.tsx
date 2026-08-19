import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/footer";
import { Grain } from "@/components/grain";
import { MotionProvider } from "@/components/motion-provider";
import { Nav } from "@/components/nav";
import { site } from "@/content/site";
import "./globals.css";

const title = site.mode === "company" ? site.name : `${site.name} — ${site.role}`;
const description = site.hero.intro;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": site.mode === "company" ? "Organization" : "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  ...(site.mode === "company" ? {} : { jobTitle: site.role }),
  address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC" },
  sameAs: site.socials.map((social) => social.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-svh bg-bg font-sans text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#content"
          className="label sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-200 focus-visible:rounded-full focus-visible:border focus-visible:border-line focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2.5"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Grain />
          <Nav />
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <main id="content">{children}</main>
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
