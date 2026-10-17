export type ProjectCategory = "website" | "ecommerce" | "landing" | "branding";

export type ProjectImage = {
  src: string;
  alt?: string;
  caption?: string;
};

export type KeyPage = {
  title: string;
  body?: string;
  image?: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  year: number;
  stack: string[];
  cover: string;
  desktopImage?: string;
  mobileImage?: string;
  images: ProjectImage[];
  categories: ProjectCategory[];
  client?: string;
  industry?: string;
  platform?: string;
  servicesOffered: string[];
  challenge?: string;
  solution?: string;
  deliverables: string[];
  keyPages: KeyPage[];
  testimonial?: { quote: string; author: string; role?: string; avatar?: string };
  liveLabel?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  aside?: string;
  body: unknown;
};
