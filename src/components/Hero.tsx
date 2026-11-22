import Link from "next/link";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto flex max-w-site flex-col gap-7 px-5 py-24 md:px-8 md:py-32">
        <p className="self-start border border-amber px-3.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-amber">
          West Loop · Chicago · Est. 2014
        </p>

        <h1
          id="hero-heading"
          className="max-w-[11em] font-display text-[clamp(3rem,2rem+5vw,6rem)] font-normal leading-[0.98] tracking-[-0.015em]"
        >
          Not a haircut.
          <br />
          <em className="text-amber">An appointment with yourself.</em>
        </h1>

        <p className="max-w-[32em] text-lg text-stone">
          Old-world barbering for the modern gentleman. Precision cuts,
          straight-razor shaves and a full, unhurried hour in the chair.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-8">
          <Link
            href="/book"
            className="bg-amber px-8 py-4 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-amber-light"
          >
            Reserve your chair
          </Link>
          <a
            href="#services"
            className="border-b border-amber pb-1.5 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:text-amber"
          >
            View services
          </a>
        </div>
      </div>
    </section>
  );
}
