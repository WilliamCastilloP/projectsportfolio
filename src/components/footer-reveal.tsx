"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const sync = () => {
      document.documentElement.style.setProperty("--footer-height", `${node.offsetHeight}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div ref={ref} className="site-footer-fixed">
      {children}
    </div>
  );
}
