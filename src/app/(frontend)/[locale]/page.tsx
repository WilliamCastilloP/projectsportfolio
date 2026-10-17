import { CtaBand } from "@/components/cta-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HomeFeaturedWork } from "@/components/home/home-featured-work";
import { HomeHero } from "@/components/home/home-hero";
import { HomeServicesPreview } from "@/components/home/home-services-preview";
import { HomeStats } from "@/components/home/home-stats";
import { getHomeContent, getServicesContent } from "@/lib/cms";
import { getFeaturedProject } from "@/lib/projects";
import { getSettings } from "@/lib/site";

export default async function HomePage() {
  const [home, settings, services, featured] = await Promise.all([
    getHomeContent(),
    getSettings(),
    getServicesContent(),
    getFeaturedProject(),
  ]);

  return (
    <>
      <HomeHero content={home} />
      <ScrollReveal>
        <HomeStats stats={settings.stats} />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <HomeServicesPreview teaser={home.servicesTeaser} intro={services.intro} items={services.items} />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <HomeFeaturedWork teaser={home.workTeaser} project={featured} />
      </ScrollReveal>
      <CtaBand />
    </>
  );
}
