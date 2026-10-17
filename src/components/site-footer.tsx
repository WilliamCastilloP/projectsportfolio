import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { LocaleControl } from "@/components/locale-control";

type SiteFooterProps = {
  tagline: string;
  socials: { label: string; href: string }[];
};

export async function SiteFooter({ tagline, socials }: SiteFooterProps) {
  const t = await getTranslations("footer");

  const links = [
    { key: "work", href: "/work" },
    { key: "services", href: "/services" },
    { key: "process", href: "/process" },
    { key: "about", href: "/about" },
  ] as const;

  return (
    <footer className="bg-footer text-footer-fg">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Image
              src="/brand/wc-digital-wordmark-white.png"
              alt="WC Digital"
              width={174}
              height={96}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{tagline}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="label text-white/50">{t("nav")}</p>
            <ul className="mt-4 space-y-2">
              {links.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-white/85 transition hover:text-white">
                    {t(`links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="label text-white/50">{t("social")}</p>
            <ul className="mt-4 space-y-2">
              {socials.length > 0
                ? socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        className="text-sm text-white/85 transition hover:text-white"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))
                : (
                  <>
                    <li>
                      <a href="mailto:hello@wcdigital.studio" className="text-sm text-white/85">
                        Email
                      </a>
                    </li>
                  </>
                )}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:text-right">
            <p className="label text-white/50">{t("ctaLabel")}</p>
            <p className="mt-3 serif-display text-2xl text-white">{t("ctaTitle")}</p>
            <Link
              href="/start"
              className="btn-primary mt-6 inline-flex bg-white text-fg hover:bg-white/90"
            >
              {t("ctaButton")}
              <ArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} WC Digital</p>
          <div className="flex flex-wrap items-center gap-4">
            <LocaleControl variant="footer" />
            <Link href="/privacy" className="text-xs text-white/50 hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-xs text-white/50 hover:text-white">
              {t("terms")}
            </Link>
            <Link href="/cookies" className="text-xs text-white/50 hover:text-white">
              {t("cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
