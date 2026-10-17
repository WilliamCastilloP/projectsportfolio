import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const bodySchema = z.object({
  projectType: z.enum(["new-website", "redesign", "ecommerce", "other"]),
  stage: z.enum(["idea", "ready", "existing"]),
  timeline: z.enum(["asap", "1-3", "3-6", "6plus"]),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  description: z.string().max(4000).optional(),
  locale: z.string().max(8).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bodySchema.parse(json);
    const payload = await getPayload({ config });

    await payload.create({
      collection: "leads",
      data: {
        projectType: data.projectType,
        stage: data.stage,
        timeline: data.timeline,
        name: data.name,
        email: data.email,
        company: data.company || "",
        description: data.description || "",
        locale: data.locale || "es",
        status: "new",
      },
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
