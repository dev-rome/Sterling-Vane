import { ConciergeChat } from "@/components/ConciergeChat";

export function Concierge() {
  return (
    <section
      id="concierge"
      aria-labelledby="concierge-heading"
      className="mx-auto flex max-w-site flex-col gap-14 px-5 py-24 md:flex-row md:items-center md:gap-20 md:px-8 md:py-36"
    >
      <div className="flex flex-col gap-6 md:flex-1">
        <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
          The concierge · AI
        </p>
        <h2
          id="concierge-heading"
          className="font-display text-[clamp(2.5rem,1.75rem+3vw,3.75rem)] leading-[1.02] font-normal"
        >
          Not sure what
          <br />
          <em className="text-amber">to ask for?</em>
        </h2>
        <p className="max-w-[32em] text-stone">
          Describe your hair, your face shape or the look you&rsquo;re after.
          The concierge suggests a service, matches you with the right barber
          and sends you straight to booking, day or night.
        </p>
      </div>

      <ConciergeChat />
    </section>
  );
}
