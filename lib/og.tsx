import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0a0a0a";
const FG = "#ededed";
const MUTED = "#a0a0a0";
const FAINT = "#6a6a6a";
const ACCENT = "#ff6a3d";

const GEIST_DIR = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts");

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: "normal";
};

/**
 * Satori needs real font buffers. These resolve at build time, when the OG
 * routes are prerendered; if the package layout ever changes we fall back to
 * the bundled default rather than failing the build.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  try {
    const [sans, mono] = await Promise.all([
      readFile(path.join(GEIST_DIR, "geist-sans", "Geist-Medium.ttf")),
      readFile(path.join(GEIST_DIR, "geist-mono", "GeistMono-Regular.ttf")),
    ]);

    return [
      { name: "Geist", data: sans.buffer as ArrayBuffer, weight: 500, style: "normal" },
      { name: "Geist Mono", data: mono.buffer as ArrayBuffer, weight: 400, style: "normal" },
    ];
  } catch {
    return [];
  }
}

/**
 * Shared OG card: grid-lined near-black, accent bloom, mono eyebrow,
 * oversized title. Used by the site card and every project card.
 */
export function OgFrame({
  eyebrow,
  title,
  description,
  footer,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  footer?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        color: FG,
        padding: 72,
        fontFamily: "Geist",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -120,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${ACCENT}2e 0%, ${BG}00 68%)`,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: ACCENT }} />
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: title.length > 34 ? 76 : 96,
            lineHeight: 1.02,
            letterSpacing: -3,
            maxWidth: 960,
          }}
        >
          {title}
        </div>
        {description ? (
          <div style={{ fontSize: 30, lineHeight: 1.4, color: MUTED, maxWidth: 860 }}>
            {description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #212121",
          paddingTop: 28,
          fontFamily: "Geist Mono",
          fontSize: 22,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: FAINT,
        }}
      >
        <div>{footer ?? ""}</div>
      </div>
    </div>
  );
}
