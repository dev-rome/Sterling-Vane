import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Services } from "@/components/Services";
import { Barbers } from "@/components/Barbers";
import { Shop } from "@/components/Shop";
import { Concierge } from "@/components/Concierge";

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <Hero />
        <OurStory />
        <Services />
        <Barbers />
        <Shop />
        <Concierge />
      </main>
    </>
  );
}
