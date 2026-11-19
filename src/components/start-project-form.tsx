"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { ShareButton } from "@/components/share-button";
import { cn } from "@/lib/cn";

type StartProjectFormProps = {
  shareUrl: string;
  shareTitle: string;
  shareText: string;
};

type FormState = {
  projectType: string;
  stage: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  description: string;
};

const fieldClass =
  "w-full rounded-xl border border-lilac/50 bg-bg px-4 py-3 text-sm text-ink transition-colors focus-visible:border-brand";

const projectTypes = ["new-website", "redesign", "ecommerce", "other"] as const;
const stages = ["idea", "ready", "existing"] as const;
const timelines = ["asap", "1-3", "3-6", "6plus"] as const;

export function StartProjectForm({ shareUrl, shareTitle, shareText }: StartProjectFormProps) {
  const t = useTranslations("start");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const [step, setStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialType = useMemo(() => {
    if (service === "ecommerce") return "ecommerce";
    if (service === "web-design" || service === "development") return "new-website";
    return "";
  }, [service]);

  const [form, setForm] = useState<FormState>({
    projectType: initialType,
    stage: "",
    timeline: "",
    name: "",
    email: "",
    company: "",
    description: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(3, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) {
        setError(t("error"));
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div role="status" className="rounded-3xl border border-teal/35 bg-teal-soft p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal text-ink" aria-hidden>
          <svg viewBox="0 0 16 16" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.2 6.4 11 12.5 4.8" />
          </svg>
        </span>
        <h2 className="serif-display mt-4 text-2xl text-ink">{t("successTitle")}</h2>
        <p className="mt-3 text-muted">{t("successBody")}</p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="max-w-sm text-sm text-balance text-fg">{shareText}</p>
          <ShareButton kind="site" url={shareUrl} title={shareTitle} text={shareText} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl border bg-surface p-6 sm:p-8",
        error ? "border-error" : "border-lilac/40",
      )}
    >
      <div className="mb-8 flex flex-wrap gap-2 text-xs font-medium">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "rounded-full px-3 py-1",
              step === n ? "bg-brand text-white" : "border border-lilac/50 text-muted",
            )}
          >
            {n}. {t(`steps.${n}`)}
          </span>
        ))}
      </div>

      <div className="min-h-[280px]">
        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="font-medium">{t("q1")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {projectTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("projectType", type)}
                  aria-pressed={form.projectType === type}
                  className={cn(
                    "rounded-2xl border p-4 text-left text-sm text-ink transition-colors",
                    form.projectType === type
                      ? "border-brand bg-brand-soft"
                      : "border-lilac/50 bg-bg hover:border-brand/35 hover:bg-brand-soft",
                  )}
                >
                  {t(`projectType.${type}`)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <h2 className="font-medium">{t("q2")}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {stages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => update("stage", stage)}
                  aria-pressed={form.stage === stage}
                  className={cn(
                    "rounded-2xl border p-4 text-sm text-ink transition-colors",
                    form.stage === stage
                      ? "border-brand bg-brand-soft"
                      : "border-lilac/50 bg-bg hover:border-brand/35 hover:bg-brand-soft",
                  )}
                >
                  {t(`stage.${stage}`)}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-sm text-muted">{t("q3")}</span>
              <select
                className={cn(fieldClass, "mt-2")}
                value={form.timeline}
                onChange={(e) => update("timeline", e.target.value)}
              >
                <option value="">{t("timelinePlaceholder")}</option>
                {timelines.map((tl) => (
                  <option key={tl} value={tl}>
                    {t(`timeline.${tl}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="font-medium">{t("q4")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className={fieldClass}
                placeholder={t("name")}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <input
                type="email"
                className={fieldClass}
                placeholder={t("email")}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <input
              className={fieldClass}
              placeholder={t("company")}
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
            <textarea
              className={cn(fieldClass, "min-h-[120px]")}
              placeholder={t("description")}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        {step > 1 ? (
          <button type="button" onClick={back} className="btn-outline text-sm">
            {t("back")}
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            disabled={step === 1 && !form.projectType}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {t("continue")}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending || !form.name || !form.email || !form.timeline || !form.stage}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {t("submit")} <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}
