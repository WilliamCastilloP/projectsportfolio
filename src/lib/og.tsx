import { readFile } from "node:fs/promises";
import path from "node:path";
import { ogPalette } from "@/lib/og-palette";

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

function Swatch({ color }: { color: string }) {
  return <div style={{ width: 18, height: 18, borderRadius: 99, background: color }} />;
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
        width: "100%",
        height: "100%",
        backgroundColor: ogPalette.bg,
        backgroundImage: `radial-gradient(circle at 100% 0%, ${ogPalette.brandSoft} 0%, transparent 40%), radial-gradient(circle at 0% 100%, ${ogPalette.tealSoft} 0%, transparent 34%), radial-gradient(circle at 100% 110%, ${ogPalette.apricotSoft} 0%, transparent 28%)`,
        color: ogPalette.ink,
        padding: "64px 72px",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: ogPalette.brand,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Swatch color={ogPalette.brand} />
          <Swatch color={ogPalette.teal} />
          <Swatch color={ogPalette.apricot} />
          <Swatch color={ogPalette.lilac} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
        <div style={{ fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 980 }}>{title}</div>
        {description ? (
          <div
            style={{
              marginTop: 24,
              fontSize: 24,
              lineHeight: 1.35,
              color: ogPalette.muted,
              maxWidth: 840,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 18, color: ogPalette.muted }}>{footer}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 56, height: 8, borderRadius: 99, background: ogPalette.brand }} />
          <div style={{ width: 18, height: 8, borderRadius: 99, background: ogPalette.teal }} />
          <div style={{ width: 18, height: 8, borderRadius: 99, background: ogPalette.apricot }} />
        </div>
      </div>
    </div>
  );
}
