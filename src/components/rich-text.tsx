import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import { Note } from "@/components/mdx";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export function RichText({
  data,
  aside,
}: {
  data: SerializedEditorState | unknown;
  aside?: string;
}) {
  if (!data) {
    return aside ? <Note>{aside}</Note> : null;
  }

  return (
    <div className="rich-text">
      <PayloadRichText data={data as SerializedEditorState} />
      {aside ? <Note>{aside}</Note> : null}
    </div>
  );
}
