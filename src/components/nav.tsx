"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Nav({
  name,
  voice,
}: {
  name: string;
  voice: "company" | "person";
}) {
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  const links = [
    { label: t("work"), href: { pathname: "/" as const, hash: "work" } },
    { label: voice === "company" ? t("studio") : t("about"), href: "/about" as const },
    { label: t("contact"), href: { pathname: "/" as const, hash: "contact" } },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        data-motion
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          isScrolled
            ? "border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label={t("aria")}
          className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-5 sm:gap-6 sm:px-8"
        >
          <Link
            href="/"
            className="label flex items-center gap-2.5 text-fg transition-colors hover:text-accent"
            aria-label={`${name} — ${t("home")}`}
          >
            <Image
              src="/brand/wctech-mark.png"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-sm border border-line"
            />
            {name}
          </Link>

          <div className="flex items-center gap-2 sm:gap-5">
            <ul className="flex items-center gap-3 sm:gap-7">
              {links.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="label text-faint transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 items-center gap-2">
              <LocaleSwitch />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </motion.div>
    </header>
  );
}
