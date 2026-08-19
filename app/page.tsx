import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <div className="rule" />
      <About />
      <div className="rule" />
      <Contact />
    </>
  );
}
