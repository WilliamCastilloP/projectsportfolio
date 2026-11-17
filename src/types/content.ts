export type ProcessMediaType = "image" | "video" | "lottie";

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  mediaType: ProcessMediaType;
  mediaUrl?: string;
  mediaAlt: string;
  cta?: { label: string; href: string };
};

export type HomeContent = {
  eyebrow: string;
  headlineLines: string[];
  headlineEmphasis: string;
  intro: string;
  floatingNotes: string[];
  servicesTeaser: { eyebrow: string; title: string; emphasis: string };
  workTeaser: { eyebrow: string; title: string; emphasis: string };
};
