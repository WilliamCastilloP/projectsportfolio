"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type ShareKind = "project" | "site";
type ShareStatus = "" | "copied" | "error";

type ShareButtonProps = {
  /** Absolute canonical URL. Built on the server; this component never reads window.location. */
  url: string;
  title: string;
  text: string;
  kind: ShareKind;
  /** Footer uses a text link. Case pages and /start success use the outline button. */
  appearance?: "button" | "link";
};

function wantsNativeShare() {
  return (
    typeof navigator.share === "function" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

function selectUrl(node: HTMLElement | null) {
  if (!node) return false;
  const selection = window.getSelection();
  if (!selection) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  return copied || selection.toString().length > 0;
}

export function ShareButton({ url, title, text, kind, appearance = "button" }: ShareButtonProps) {
  const t = useTranslations("share");
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ShareStatus>("");
  const [revealUrl, setRevealUrl] = useState(false);

  const label = t(kind);
  const menuUp = appearance === "link";

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!revealUrl) return;
    selectUrl(urlRef.current);
  }, [revealUrl]);

  useLayoutEffect(() => {
    if (!open || !menuRef.current || !triggerRef.current) return;
    const menu = menuRef.current;
    const trigger = triggerRef.current.getBoundingClientRect();
    const overflow = trigger.left + menu.offsetWidth > window.innerWidth - 12;
    menu.style.left = overflow ? "auto" : "0";
    menu.style.right = overflow ? "0" : "auto";
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items?.length || !triggerRef.current) return;
      const list = [triggerRef.current, ...items];
      const index = list.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next = event.shiftKey
        ? index <= 0
          ? list.length - 1
          : index - 1
        : index === -1 || index >= list.length - 1
          ? 0
          : index + 1;
      list[next]?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  async function copyLink() {
    setRevealUrl(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
        return;
      }
    } catch {
      // Permission or insecure context: fall through to a visible selection.
    }

    setRevealUrl(true);
    setStatus(selectUrl(urlRef.current) ? "copied" : "error");
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    void onActivate();
  }

  async function onActivate() {
    if (wantsNativeShare()) {
      setOpen(false);
      try {
        await navigator.share({
          url,
          ...(title ? { title } : {}),
          ...(text ? { text } : {}),
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
        setOpen(true);
      }
      return;
    }

    setOpen((value) => !value);
  }

  const subject = t("emailSubject", { title });
  const body = t("emailBody", { text, url, title });
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          appearance === "link"
            ? "footer-link inline-flex items-center gap-1.5 text-xs"
            : "btn-outline hover:text-brand",
        )}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="menu"
        onClick={onActivate}
        onKeyDown={onTriggerKeyDown}
      >
        <ShareIcon />
        {label}
      </button>

      <p
        aria-live="polite"
        className={cn(
          appearance === "button" && status === "copied" &&
            "absolute bottom-full left-0 z-30 mb-2 inline-flex w-max max-w-[min(100vw-2.5rem,18rem)] items-center gap-2 rounded-full border border-teal/30 bg-teal-soft px-3 py-1.5 text-sm text-ink shadow-sm sm:bottom-auto sm:left-full sm:top-1/2 sm:mb-0 sm:ml-3 sm:-translate-y-1/2",
          appearance === "button" && status === "error" &&
            "absolute bottom-full left-0 z-30 mb-2 w-max max-w-xs text-left text-sm text-error sm:bottom-auto sm:left-full sm:top-1/2 sm:mb-0 sm:ml-3 sm:-translate-y-1/2",
          (appearance === "link" || !status) && "sr-only",
        )}
      >
        {status === "copied" ? (
          <>
            <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-ink">
              <CheckIcon />
            </span>
            {t("copied")}
          </>
        ) : null}
        {status === "error" ? t("error") : null}
      </p>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute left-0 z-30 w-56 rounded-2xl border border-lilac/30 bg-surface p-1.5 text-left shadow-[0_12px_32px_color-mix(in_oklab,var(--ink)_12%,transparent)]",
            menuUp ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {appearance === "link" && status ? (
            <p
              aria-hidden
              className={cn(
                "mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                status === "copied" ? "bg-teal-soft text-ink" : "text-error",
              )}
            >
              {status === "copied" ? (
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-ink">
                  <CheckIcon />
                </span>
              ) : null}
              {status === "copied" ? t("copied") : t("error")}
            </p>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-brand-soft focus-visible:bg-brand-soft"
            onClick={copyLink}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              void copyLink();
            }}
          >
            <LinkIcon />
            {t("copy")}
          </button>
          <a
            role="menuitem"
            href={mailto}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-brand-soft focus-visible:bg-brand-soft"
          >
            <MailIcon />
            {t("email")}
          </a>
          <p
            ref={urlRef}
            className={cn("px-3 py-2 text-xs break-all text-muted select-text", revealUrl ? "block" : "sr-only")}
          >
            {url}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 14.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4.5" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 6.2 4.7 8.4 9.5 3.6" />
    </svg>
  );
}
