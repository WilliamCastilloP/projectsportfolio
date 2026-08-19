import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { mdxComponents } from "@/components/mdx";
import { getAllProjects, getProject, getProjectNeighbours } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const { previous, next } = await getProjectNeighbours(slug);

  const links = [
    project.liveUrl ? { label: "Live site", href: project.liveUrl } : null,
    project.repoUrl ? { label: "Source", href: project.repoUrl } : null,
  ].filter((link) => link !== null);

  return (
    <article className="pt-28 pb-16 sm:pt-32">
      <Link
        href="/#work"
        className="label group inline-flex items-center gap-2 text-faint transition-colors hover:text-fg"
      >
        <span
          aria-hidden
          className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-0.5"
        >
          ←
        </span>
        Back to work
      </Link>

      <header className="mt-10">
        <SectionLabel>{`${project.year} / ${project.stack.slice(0, 3).join(" · ")}`}</SectionLabel>
        <h1 className="mt-5 text-title font-medium text-balance">{project.title}</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted text-pretty">
          {project.description}
        </p>
      </header>

      <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-elevated">
          <Image
            src={project.cover}
            alt={`${project.title} — cover`}
            fill
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </ViewTransition>

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
        <aside className="md:col-span-4 md:order-2">
          <div className="md:sticky md:top-24">
            <dl className="divide-y divide-line border-y border-line">
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="label text-faint">Year</dt>
                <dd className="label text-fg">{project.year}</dd>
              </div>
              <div className="flex flex-col gap-3 py-3.5">
                <dt className="label text-faint">Stack</dt>
                <dd className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="label rounded-full border border-line px-2.5 py-1.5 text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            {links.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="label group inline-flex items-center gap-2 text-fg transition-colors hover:text-accent"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </aside>

        <div className="md:col-span-8 md:order-1">
          <MDXRemote
            source={project.body}
            components={mdxComponents}
            options={{ parseFrontmatter: false, blockJS: false }}
          />
        </div>
      </div>

      {project.images.length > 0 ? (
        <section className="mt-16">
          <div className="border-b border-line pb-6">
            <SectionLabel>Screens</SectionLabel>
          </div>
          <div className="mt-8 space-y-6">
            {project.images.map((image, index) => (
              <Reveal key={image.src} amount={0.1}>
                <figure>
                  <div className="overflow-hidden rounded-xl border border-line bg-elevated">
                    <Image
                      src={image.src}
                      alt={image.alt ?? `${project.title} — screen ${index + 1}`}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 1024px) 896px, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="label mt-3 text-faint normal-case">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <nav
        aria-label="More projects"
        className="mt-20 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
      >
        {previous ? (
          <Link href={`/work/${previous.slug}`} className="group">
            <span className="label text-faint">Previous</span>
            <span className="mt-2 block text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="group sm:text-right">
            <span className="label text-faint">Next</span>
            <span className="mt-2 block text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
