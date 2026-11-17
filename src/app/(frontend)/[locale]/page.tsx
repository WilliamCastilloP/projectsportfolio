import { CtaBand } from "@/components/cta-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProcessSection } from "@/components/process/process-section";
import { HomeFeaturedWork } from "@/components/home/home-featured-work";
import { HomeHero } from "@/components/home/home-hero";
import { HomeServicesPreview } from "@/components/home/home-services-preview";
import { getHomeContent, getServicesContent } from "@/lib/cms";
import { getFeaturedProject } from "@/lib/projects";

export default async function HomePage() {
  const [home, services, featured] = await Promise.all([
    getHomeContent(),
    getServicesContent(),
    getFeaturedProject(),
  ]);

  return (
    <>
      <HomeHero content={home} />
      <ScrollReveal delay={80}>
        <HomeServicesPreview teaser={home.servicesTeaser} intro={services.intro} items={services.items} />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <HomeFeaturedWork teaser={home.workTeaser} project={featured} />
      </ScrollReveal>
      <ProcessSection />
      <CtaBand />
    </>
  );
}
