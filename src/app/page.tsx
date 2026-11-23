import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <Hero />
        <OurStory />
      </main>
    </>
  );
}
