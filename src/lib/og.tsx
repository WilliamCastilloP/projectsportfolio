import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export async function loadOgFonts() {
  try {
    const geist = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts", "geist-sans", "Geist-Regular.ttf");
    const data = await readFile(geist);
    return [{ name: "Geist", data, style: "normal" as const, weight: 400 as const }];
  } catch {
    return [];
  }
}

export function OgFrame({
  eyebrow,
  title,
  description,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#faf8f5",
        color: "#111",
        padding: "64px",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div style={{ fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6 }}>
        {eyebrow}
      </div>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
      <div style={{ fontSize: 22, opacity: 0.7, maxWidth: 800 }}>{description}</div>
      <div style={{ fontSize: 18, opacity: 0.5 }}>{footer}</div>
    </div>
  );
}
