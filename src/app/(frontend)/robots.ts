import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${settings.url}/sitemap.xml`,
    host: settings.url,
  };
}
