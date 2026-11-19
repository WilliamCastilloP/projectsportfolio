/**
 * Ilustraciones de `/services`, por la clave `illustration` del CMS
 * (`web-design`, `development`, `ecommerce`, `digital-presence`).
 * Color solo con variables de la paleta: Violet de marca y un acento Teal.
 */
const scenes: Record<string, React.ReactNode> = {
  "web-design": (
    <>
      <rect x="64" y="36" width="352" height="248" rx="22" fill="var(--surface)" />
      <rect x="64" y="36" width="352" height="248" rx="22" fill="none" stroke="var(--ink)" strokeOpacity="0.12" />
      <circle cx="92" cy="62" r="5" fill="var(--lilac)" />
      <circle cx="110" cy="62" r="5" fill="var(--lilac)" />
      <circle cx="128" cy="62" r="5" fill="var(--teal)" />
      <rect x="156" y="54" width="120" height="16" rx="8" fill="var(--ink)" opacity="0.08" />
      <rect x="92" y="96" width="168" height="16" rx="8" fill="var(--ink)" />
      <rect x="92" y="122" width="112" height="10" rx="5" fill="var(--ink)" opacity="0.28" />
      <rect x="92" y="156" width="128" height="88" rx="14" fill="var(--teal)" />
      <rect x="232" y="156" width="140" height="40" rx="12" fill="var(--brand)" opacity="0.16" />
      <rect x="232" y="206" width="140" height="38" rx="12" fill="var(--ink)" opacity="0.08" />
    </>
  ),
  development: (
    <>
      <rect x="64" y="40" width="88" height="240" rx="18" fill="var(--ink)" />
      <rect x="84" y="64" width="48" height="8" rx="4" fill="var(--bg)" opacity="0.45" />
      <rect x="84" y="84" width="36" height="8" rx="4" fill="var(--teal)" />
      <rect x="84" y="104" width="48" height="8" rx="4" fill="var(--bg)" opacity="0.28" />
      <rect x="168" y="40" width="248" height="240" rx="18" fill="var(--surface)" />
      <rect x="168" y="40" width="248" height="240" rx="18" fill="none" stroke="var(--ink)" strokeOpacity="0.12" />
      <rect x="196" y="72" width="120" height="10" rx="5" fill="var(--brand)" />
      <rect x="196" y="96" width="176" height="10" rx="5" fill="var(--ink)" opacity="0.2" />
      <rect x="212" y="120" width="140" height="10" rx="5" fill="var(--ink)" opacity="0.35" />
      <rect x="212" y="144" width="96" height="10" rx="5" fill="var(--teal)" />
      <rect x="196" y="168" width="160" height="10" rx="5" fill="var(--ink)" opacity="0.2" />
      <rect x="196" y="204" width="14" height="28" rx="4" fill="var(--brand)" />
    </>
  ),
  ecommerce: (
    <>
      <rect x="56" y="48" width="168" height="200" rx="20" fill="var(--surface)" />
      <rect x="56" y="48" width="168" height="200" rx="20" fill="none" stroke="var(--ink)" strokeOpacity="0.12" />
      <rect x="76" y="68" width="128" height="96" rx="14" fill="var(--brand)" opacity="0.14" />
      <rect x="76" y="178" width="88" height="10" rx="5" fill="var(--ink)" />
      <rect x="76" y="198" width="48" height="10" rx="5" fill="var(--teal)" />
      <rect x="248" y="48" width="168" height="200" rx="20" fill="var(--surface)" />
      <rect x="248" y="48" width="168" height="200" rx="20" fill="none" stroke="var(--ink)" strokeOpacity="0.12" />
      <rect x="268" y="68" width="128" height="96" rx="14" fill="var(--ink)" opacity="0.06" />
      <circle cx="332" cy="112" r="22" fill="var(--teal)" />
      <path d="M322 112.5 329 119.5 344 104" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="268" y="178" width="96" height="10" rx="5" fill="var(--ink)" opacity="0.35" />
      <rect x="268" y="198" width="56" height="10" rx="5" fill="var(--ink)" opacity="0.18" />
    </>
  ),
  "digital-presence": (
    <>
      <rect x="64" y="44" width="352" height="232" rx="22" fill="var(--surface)" />
      <rect x="64" y="44" width="352" height="232" rx="22" fill="none" stroke="var(--ink)" strokeOpacity="0.12" />
      <path d="M100 214h280" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="2" />
      <rect x="112" y="168" width="36" height="46" rx="8" fill="var(--ink)" opacity="0.16" />
      <rect x="168" y="140" width="36" height="74" rx="8" fill="var(--ink)" opacity="0.28" />
      <rect x="224" y="116" width="36" height="98" rx="8" fill="var(--brand)" opacity="0.35" />
      <rect x="280" y="84" width="36" height="130" rx="8" fill="var(--teal)" />
      <circle cx="360" cy="86" r="16" fill="var(--brand)" />
      <path d="M360 78v10M355 84h10" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function ServiceIllustration({ name }: { name: string }) {
  const key = name.trim().toLowerCase();
  return (
    <svg viewBox="0 0 480 320" aria-hidden className="h-auto w-full max-w-md">
      {scenes[key] ?? scenes["web-design"]}
    </svg>
  );
}
