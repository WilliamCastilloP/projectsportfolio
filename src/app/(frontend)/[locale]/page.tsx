import { CtaBand } from "@/components/cta-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProcessSection } from "@/components/process/process-section";
import { HomeFeaturedWork } from "@/components/home/home-featured-work";
import { HomeHero } from "@/components/home/home-hero";
import { HomeServicesPreview } from "@/components/home/home-services-preview";
import { getHomeContent, getServicesContent } from "@/lib/cms";
import { getAllProjects } from "@/lib/projects";

export default async function HomePage() {
  const [home, services, allProjects] = await Promise.all([
    getHomeContent(),
    getServicesContent(),
    getAllProjects(),
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
      <CtaBand />
    </>
  );
}
