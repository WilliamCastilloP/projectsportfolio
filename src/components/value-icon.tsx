const paths: Record<string, React.ReactNode> = {
  quality: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </>
  ),
  transparency: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  collaboration: (
    <>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </>
  ),
  results: (
    <>
      <path d="M4 19.5h16" />
      <path d="m5 15 4.5-4.5 3.5 3.5L19 8" />
      <path d="M15 8h4v4" />
    </>
  ),
};

/**
 * `about-page.values[].icon` guarda una clave (`quality`, `transparency`…), no un texto visible.
 * Claves conocidas → SVG; un emoji o símbolo se pinta tal cual; cualquier otra palabra, un punto neutro.
 */
export function ValueIcon({ name }: { name?: string }) {
  const key = name?.trim().toLowerCase() ?? "";
  const path = paths[key];
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {path}
      </svg>
    );
  }
  if (key && !/\p{L}/u.test(key)) return <span aria-hidden>{name}</span>;
  return <span aria-hidden>◦</span>;
}
