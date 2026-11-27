import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Services } from "@/components/Services";
import { Barbers } from "@/components/Barbers";
import { Shop } from "@/components/Shop";
import { Concierge } from "@/components/Concierge";
import { Reviews } from "@/components/Reviews";
import { CtaBanner } from "@/components/CtaBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <LocalBusinessJsonLd />
        <Hero />
        <OurStory />
        <Services />
        <Barbers />
        <Shop />
        <Concierge />
        <Reviews />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
