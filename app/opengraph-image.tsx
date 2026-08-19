import { ImageResponse } from "next/og";
import { loadOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow={site.name}
        title={site.hero.headline.join(" ")}
        description={site.hero.intro}
        footer={site.url.replace(/^https?:\/\//, "")}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
