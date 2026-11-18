import { CtaBand } from "@/components/cta-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProcessSection } from "@/components/process/process-section";
import { HomeCustomBuilt } from "@/components/home/home-custom-built";
import { HomeFeaturedWork } from "@/components/home/home-featured-work";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMotto } from "@/components/home/home-motto";
import { HomeServicesPreview } from "@/components/home/home-services-preview";
import { HomeYouEdit } from "@/components/home/home-you-edit";
import { getAboutContent, getHomeContent, getServicesContent } from "@/lib/cms";
import { getAllProjects } from "@/lib/projects";
import { getSettings } from "@/lib/site";

export default async function HomePage() {
  const [home, services, allProjects, about, settings] = await Promise.all([
    getHomeContent(),
    getServicesContent(),
    getAllProjects(),
    getAboutContent(),
    getSettings(),
  ]);
  const recentProjects = allProjects.slice(0, 3);

  return (
    <>
      <HomeHero content={home} />
      <ScrollReveal delay={80}>
        <HomeServicesPreview teaser={home.servicesTeaser} intro={services.intro} items={services.items} />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <HomeFeaturedWork teaser={home.workTeaser} projects={recentProjects} />
      </ScrollReveal>
      <ProcessSection />
      <ScrollReveal delay={80}>
        <HomeCustomBuilt />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <HomeYouEdit />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <HomeMotto motto={about.motto} studioName={settings.name} />
      </ScrollReveal>
      <CtaBand />
    </>
  );
}
