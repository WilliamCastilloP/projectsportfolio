import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { LocaleControl } from "@/components/locale-control";
import { ShareButton } from "@/components/share-button";

type SiteFooterProps = {
  name: string;
  tagline: string;
  publicEmail: string;
  socials: { label: string; href: string }[];
  shareUrl: string;
  shareTitle: string;
  shareText: string;
};

export async function SiteFooter({
  name,
  tagline,
  publicEmail,
  socials,
  shareUrl,
  shareTitle,
  shareText,
}: SiteFooterProps) {
  const t = await getTranslations("footer");

  const links = [
    { key: "work", href: "/work" },
    { key: "services", href: "/services" },
    { key: "process", href: "/#process" },
    { key: "about", href: "/about" },
  ] as const;

  const legal = [
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
    { key: "cookies", href: "/cookies" },
  ] as const;

  const email = publicEmail.trim();

  return (
    <footer className="footer-sheet bg-footer text-footer-fg">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="serif-display text-3xl text-footer-fg">{name}</p>
            {tagline ? <p className="footer-quiet mt-4 max-w-xs text-sm leading-relaxed">{tagline}</p> : null}
          </div>

          <div className="lg:col-span-3">
            <p className="label footer-quiet">{t("nav")}</p>
            <ul className="mt-4 space-y-2">
              {links.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link text-sm">
                    {t(`links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="label footer-quiet">{t("ctaLabel")}</p>
            <p className="mt-3 serif-display text-3xl text-balance text-footer-fg">{t("write")}</p>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-block text-base text-apricot underline decoration-apricot/70 underline-offset-4 transition-colors hover:decoration-apricot"
              >
                {email}
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-bg/15 pt-6 text-xs sm:mt-14 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-3">
          <p className="footer-quiet">
            © {new Date().getFullYear()} {name}
          </p>
          <LocaleControl variant="footer" />
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {legal.map((item, index) => (
              <span key={item.key} className="inline-flex items-center gap-x-2">
                {index > 0 ? (
                  <span aria-hidden className="footer-quiet">
                    ·
                  </span>
                ) : null}
                <Link href={item.href} className="footer-link">
                  {t(item.key)}
                </Link>
              </span>
            ))}
          </p>
          <ShareButton appearance="link" kind="site" url={shareUrl} title={shareTitle} text={shareText} />
          {socials.length > 0 ? (
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:ml-auto">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="footer-link inline-flex items-center gap-1"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {s.label}
                  <ArrowUpRight />
                </a>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      <p aria-hidden className="footer-wordmark select-none">
        {name}
      </p>
    </footer>
  );
}
