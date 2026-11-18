import { getTranslations } from "next-intl/server";

function TealCheck() {
  return (
    <span
      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-white"
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="size-3" fill="none">
        <path
          d="M2.5 6.2 4.8 8.5 9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export async function HomeCustomBuilt() {
  const t = await getTranslations("home.customBuilt");
  const template = [t("template1"), t("template2"), t("template3"), t("template4")];
  const custom = [t("custom1"), t("custom2"), t("custom3"), t("custom4")];

  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,color-mix(in_oklab,var(--brand)_12%,transparent),transparent_70%),radial-gradient(ellipse_50%_50%_at_12%_80%,color-mix(in_oklab,var(--teal)_10%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="label text-center text-faint">{t("eyebrow")}</p>
        <h2 className="mt-3 text-center serif-display text-title text-fg text-balance">
          {t("title")} <span className="italic text-brand">{t("emphasis")}</span>
        </h2>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <article className="rounded-2xl bg-elevated/90 p-6 sm:p-8">
            <p className="text-sm font-medium text-muted">{t("templateLabel")}</p>
            <ul className="mt-6 space-y-4">
              {template.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-px w-3 shrink-0 bg-faint" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border-2 border-brand/30 bg-surface p-6 shadow-[0_18px_44px_color-mix(in_oklab,var(--brand)_10%,transparent)] sm:p-8">
            <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
              {t("customLabel")}
            </p>
            <ul className="mt-6 space-y-4">
              {custom.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-fg">
                  <TealCheck />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
