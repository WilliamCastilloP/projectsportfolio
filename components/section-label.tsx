import { cn } from "@/lib/utils";

/** "01 / WORK" — the recurring editorial eyebrow. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label flex items-center gap-2 text-faint", className)}>
      {index ? (
        <>
          <span className="text-accent">{index}</span>
          <span aria-hidden className="text-faint/60">
            /
          </span>
        </>
      ) : null}
      <span className="text-muted">{children}</span>
    </p>
  );
}
