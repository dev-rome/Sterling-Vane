import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-dvh items-center justify-center">
        <h1 className="font-display text-6xl">
          Sterling <em className="text-amber">&amp;</em> Vane
        </h1>
      </main>
    </>
  );
}
