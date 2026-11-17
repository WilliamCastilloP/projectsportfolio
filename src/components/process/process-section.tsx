import { ProcessScrollytelling } from "@/components/process/process-scrollytelling";
import { getProcessContent } from "@/lib/cms";

export async function ProcessSection() {
  const content = await getProcessContent();
  if (content.steps.length === 0) return null;
  return <ProcessScrollytelling content={content} />;
}
