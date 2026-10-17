import { ImageResponse } from "next/og";
import { loadOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { getSettings } from "@/lib/site";

export const alt = "WC Digital";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale === "fr" ? "fr" : locale === "en" ? "en" : "es";
  const settings = await getSettings(loc);
  const home = await import("@/lib/cms").then((m) => m.getHomeContent(loc));
  return new ImageResponse(
    (
      <OgFrame
        eyebrow={settings.name}
        title={[...home.headlineLines, home.headlineEmphasis].join(" ")}
        description={home.intro}
        footer={settings.url.replace(/^https?:\/\//, "")}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
