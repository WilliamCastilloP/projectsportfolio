import { cn } from "@/lib/utils";

/**
 * Soft radial wash sitting behind the hero. Two stacked gradients: a wide
 * neutral lift so the near-black doesn't read as flat, and a tight accent
 * bloom off-centre.
 */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="absolute top-[-30%] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(237,237,237,0.07) 0%, rgba(237,237,237,0) 70%)",
        }}
      />
      <div
        className="absolute top-[-10%] left-[62%] h-[52vh] w-[52vh] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-accent) 22%, transparent) 0%, transparent 72%)",
        }}
      />
    </div>
  );
}
