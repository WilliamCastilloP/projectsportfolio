import Image from "next/image";
import type { MDXComponents } from "mdx/types";

/** `<Figure />` is available inside project MDX for inline screenshots. */
export function Figure({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10 first:mt-0">
      <div className="overflow-hidden rounded-lg border border-line bg-elevated">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="label mt-3 text-faint normal-case">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** `<Note />` — a single accented aside. Use it sparingly. */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-accent/60 bg-surface py-4 pr-4 pl-5 text-sm leading-relaxed text-muted">
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-xl font-medium tracking-tight text-fg sm:text-2xl" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-10 mb-3 text-base font-medium tracking-tight text-fg sm:text-lg" {...props} />
  ),
  p: (props) => <p className="my-5 leading-relaxed text-muted text-pretty" {...props} />,
  a: ({ href = "", ...props }) => {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
        {...props}
      />
    );
  },
  ul: (props) => (
    <ul
      className="my-5 list-none space-y-2.5 pl-0 [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:top-[0.72em] [&>li]:before:left-0 [&>li]:before:h-px [&>li]:before:w-2.5 [&>li]:before:bg-accent/70"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-5 list-decimal space-y-2.5 pl-5 marker:font-mono marker:text-sm marker:text-faint"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed text-muted text-pretty" {...props} />,
  strong: (props) => <strong className="font-medium text-fg" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-line pl-5 text-lg leading-relaxed text-fg italic"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-8 overflow-x-auto rounded-lg border border-line bg-elevated p-5 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  img: ({ src, alt }) => (
    <Figure src={typeof src === "string" ? src : ""} alt={alt ?? ""} />
  ),
  Figure,
  Note,
};
