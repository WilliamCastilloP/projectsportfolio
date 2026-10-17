import type { Media } from "@/types/payload-types";

export function mediaUrl(value: number | Media | null | undefined): string {
  if (!value || typeof value === "number") return "";
  if (typeof value.url === "string" && value.url.length > 0) return value.url;
  if (typeof value.filename === "string" && value.filename.length > 0) {
    return `/api/media/file/${encodeURIComponent(value.filename)}`;
  }
  return "";
}
