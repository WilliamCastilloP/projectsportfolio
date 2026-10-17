import { cn } from "@/lib/cn";

function IconWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-fg",
        className,
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  if (slug === "development") {
    return (
      <IconWrap className={className}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      </IconWrap>
    );
  }
  if (slug === "ecommerce") {
    return (
      <IconWrap className={className}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 7h15l-1.5 8H8L6 7Z" />
          <path d="M6 7 5 4H2" />
          <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      </IconWrap>
    );
  }
  if (slug === "digital-presence") {
    return (
      <IconWrap className={className}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 19V9l4 3 4-8 4 8 4-3v10" />
        </svg>
      </IconWrap>
    );
  }
  return (
    <IconWrap className={className}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="13" rx="1.5" />
        <path d="M8 21h8" />
      </svg>
    </IconWrap>
  );
}
