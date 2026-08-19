"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { site } from "@/content/site";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  /** Pre-Clipboard-API path, also the escape hatch when permission is denied. */
  function copyViaSelection(text: string) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();

    try {
      return document.execCommand("copy");
    } finally {
      field.remove();
    }
  }

  async function copyEmail() {
    let ok = false;

    try {
      await navigator.clipboard.writeText(site.email);
      ok = true;
    } catch {
      ok = copyViaSelection(site.email);
    }

    // If both paths fail the mailto link beside the button still works, so
    // stay silent rather than claim a copy that didn't happen.
    if (!ok) return;

    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <Reveal>
        <div className="border-b border-line pb-6">
          <SectionLabel index="03">{site.contact.heading}</SectionLabel>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <p className="max-w-xl leading-relaxed text-muted text-pretty">{site.contact.body}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${site.email}`}
            className="text-title font-medium tracking-tight break-all transition-colors hover:text-accent"
          >
            {site.email}
          </a>

          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy ${site.email} to clipboard`}
            className="label relative inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 text-faint transition-colors hover:border-fg/25 hover:text-fg"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2"
              >
                {copied ? <span className="text-accent">Copied</span> : "Copy email"}
              </motion.span>
            </AnimatePresence>
          </button>

          <span aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label group inline-flex items-center gap-1.5 text-faint transition-colors hover:text-fg"
              >
                {social.label}
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
