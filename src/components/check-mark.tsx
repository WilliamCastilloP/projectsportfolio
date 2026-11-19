import { cn } from "@/lib/cn";

/** El trazo va en ink: Teal sobre crema queda por debajo de 3:1, así que el color vive en el relleno. */
export function CheckMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-soft text-ink",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.2 6.4 11 12.5 4.8" />
      </svg>
    </span>
  );
}
