import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { LanguageModal } from "@/components/language-modal";
import { HtmlLang } from "@/components/html-lang";
import { MotionProvider } from "@/components/motion-provider";
import { FooterReveal } from "@/components/footer-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { routing, type Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const loc = locale as Locale;
  const jar = await cookies();
  const showLanguageModal = !jar.has("wc-locale") && !jar.has("wc-locale-modal-dismissed");
  const [settings, messages, t] = await Promise.all([
    getSettings(loc),
    getMessages(),
    getTranslations("a11y"),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      <LanguageModal defaultOpen={showLanguageModal} />
      <a
        href="#content"
        className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        {t("skip")}
      </a>
      <MotionProvider>
        <div className="site-shell">
          <SiteNav />
          <main id="content" className="pt-20 sm:pt-24">{children}</main>
        </div>
      </MotionProvider>
      <FooterReveal>
        <SiteFooter tagline={settings.tagline} socials={settings.socials} />
      </FooterReveal>
    </NextIntlClientProvider>
  );
}
