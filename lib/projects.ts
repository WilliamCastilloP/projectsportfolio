import "server-only";

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** `/projects/slug/shot.png` or a plain string shorthand for the same. */
const imageSchema = z
  .union([
    z.string().min(1),
    z.object({
      src: z.string().min(1),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }),
  ])
  .transform((value) =>
    typeof value === "string" ? { src: value, alt: undefined, caption: undefined } : value,
  );

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(240),
  year: z.coerce.number().int().gte(1990).lte(2999),
  stack: z.array(z.string().min(1)).min(1),
  cover: z.string().startsWith("/", "cover must be a path under public/, e.g. /projects/slug/cover.png"),
  images: z.array(imageSchema).default([]),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  /** Lower sorts first on the home page. */
  order: z.coerce.number().int().default(100),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  slug: string;
  /** Raw MDX body, frontmatter stripped. */
  body: string;
};

function assetExists(publicPath: string) {
  const relative = publicPath.replace(/^\//, "");
  return existsSync(path.join(PUBLIC_DIR, relative));
}

function parseProject(slug: string, raw: string): Project {
  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/projects/${slug}.mdx\n${z.prettifyError(parsed.error)}`,
    );
  }

  // Catching a typo'd screenshot path at build time beats a broken <Image> in prod.
  const missing = [parsed.data.cover, ...parsed.data.images.map((image) => image.src)].filter(
    (src) => !assetExists(src),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing image asset(s) for content/projects/${slug}.mdx:\n${missing
        .map((src) => `  public${src}`)
        .join("\n")}`,
    );
  }

  return { slug, body: content, ...parsed.data };
}

/** Featured first, then `order`, then most recent. */
function compareProjects(a: Project, b: Project) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

export const getAllProjects = cache(async (): Promise<Project[]> => {
  const entries = await readdir(PROJECTS_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name);

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await readFile(path.join(PROJECTS_DIR, file), "utf8");
      return parseProject(slug, raw);
    }),
  );

  return projects.sort(compareProjects);
});

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

/** Next/previous in display order, for the detail page footer. */
export async function getProjectNeighbours(slug: string) {
  const projects = await getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
