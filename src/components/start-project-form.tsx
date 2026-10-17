"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { cn } from "@/lib/cn";

type FormState = {
  projectType: string;
  stage: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  description: string;
};

const projectTypes = ["new-website", "redesign", "ecommerce", "other"] as const;
const stages = ["idea", "ready", "existing"] as const;
const timelines = ["asap", "1-3", "3-6", "6plus"] as const;

export function StartProjectForm() {
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
      <div className="rounded-3xl border border-line bg-surface p-8 text-center">
        <h2 className="serif-display text-2xl">{t("successTitle")}</h2>
        <p className="mt-3 text-muted">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="mb-8 flex gap-2 text-xs font-medium">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "rounded-full px-3 py-1",
              step === n ? "bg-fg text-surface" : "bg-elevated text-muted",
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
                  className={cn(
                    "rounded-2xl border p-4 text-left text-sm transition",
                    form.projectType === type ? "border-fg bg-elevated" : "border-line hover:border-fg/30",
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
                  className={cn(
                    "rounded-2xl border p-4 text-sm transition",
                    form.stage === stage ? "border-fg bg-elevated" : "border-line",
                  )}
                >
                  {t(`stage.${stage}`)}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-sm text-muted">{t("q3")}</span>
              <select
                className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm"
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
                className="rounded-xl border border-line px-4 py-3 text-sm"
                placeholder={t("name")}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <input
                type="email"
                className="rounded-xl border border-line px-4 py-3 text-sm"
                placeholder={t("email")}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <input
              className="w-full rounded-xl border border-line px-4 py-3 text-sm"
              placeholder={t("company")}
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-line px-4 py-3 text-sm"
              placeholder={t("description")}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

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
            {t("submit")} <ArrowUpRight />
          </button>
        )}
      </div>
    </div>
  );
}
