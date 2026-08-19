/**
 * Single source of truth for everything that is "you".
 * Edit this file first when you fork the portfolio — nothing else hardcodes
 * a name, an email or a URL.
 */

export type SiteMode = "person" | "company";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * `mode` switches the voice of the About section (and the schema.org type
 * exposed to crawlers) between a solo portfolio and a studio site.
 * Only the copy under the matching key is rendered.
 */
export const site = {
  mode: "person" as SiteMode,

  /** Used for <title>, OG images and the hero. */
  name: "Your Name",
  /** Short role line rendered under the hero headline. */
  role: "Full-stack developer",
  /** IANA timezone powering the footer clock. */
  timeZone: "America/Toronto",
  location: "Montréal, Québec",
  email: "hello@yourdomain.com",
  /** No trailing slash. Drives canonical URLs, sitemap and OG image URLs. */
  url: "https://yourdomain.com",

  hero: {
    /** Rendered one line per array entry, revealed in sequence. */
    headline: ["Calm interfaces", "for loud problems."],
    intro:
      "I design and ship web products end to end — from the data model to the last easing curve.",
  },

  about: {
    person: {
      heading: "About",
      body: [
        "I'm a developer based in Montréal. I like products that stay legible under pressure: clear data models, honest loading states, and interfaces that explain themselves without a tour.",
        "Most of my work sits between the design file and production — typed contracts, accessible components, and the kind of performance work that never makes it into a screenshot.",
      ],
      /** Rendered as a small monospace list. Keep it factual. */
      facts: [
        { label: "Based in", value: "Montréal, QC" },
        { label: "Focus", value: "Product engineering" },
        { label: "Availability", value: "Open to new work" },
      ],
    },
    company: {
      heading: "About the studio",
      body: [
        "We're a small product studio in Montréal. We take on a handful of engagements at a time so the people who scope the work are the people who build it.",
        "Our work spans discovery, interface design and implementation — shipped as a codebase your team can own, not a handoff.",
      ],
      facts: [
        { label: "Based in", value: "Montréal, QC" },
        { label: "Practice", value: "Design & engineering" },
        { label: "Availability", value: "Taking new projects" },
      ],
    },
  },

  contact: {
    heading: "Contact",
    body: "The fastest way to reach me is email. I read everything and reply to anything with a clear ask.",
  },

  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ] satisfies NavLink[],

  socials: [
    { label: "GitHub", href: "https://github.com/yourhandle" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yourhandle" },
  ] satisfies SocialLink[],
} as const;

export const isCompany = site.mode === "company";

/** The About copy for the active `mode`. */
export const aboutContent = site.about[site.mode];
