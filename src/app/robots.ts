import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/metadata";
import { getSettings } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${settings.url}/sitemap.xml`,
    host: settings.url,
  };
}
