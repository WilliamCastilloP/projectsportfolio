import Link from "next/link";
import { SectionLabel } from "@/components/section-label";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col justify-center py-24">
      <SectionLabel index="404">Not found</SectionLabel>
      <h1 className="mt-6 text-title font-medium text-balance">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        The link may be out of date, or the project moved.
      </p>
      <Link
        href="/"
        className="label mt-10 inline-flex w-fit items-center gap-2 border-b border-fg/25 pb-1.5 transition-colors hover:border-accent hover:text-accent"
      >
        Back home
      </Link>
    </section>
  );
}
