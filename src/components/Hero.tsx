import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/images/hero.jpg";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-160 items-center overflow-hidden md:min-h-220"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-espresso/75 md:bg-transparent md:bg-linear-to-r md:from-espresso/95 md:via-espresso/85 md:to-espresso/15"
      />

      <div className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 pt-36 pb-12 md:px-8 md:pt-44 md:pb-10">
        <p className="self-start border border-amber px-3.5 py-1.5 text-[0.6875rem] font-medium tracking-[0.28em] text-amber uppercase">
          West Loop · Chicago · Est. 2014
        </p>

        <h1
          id="hero-heading"
          className="max-w-[11em] font-display text-[clamp(3rem,2rem+5vw,6rem)] leading-[0.98] font-normal tracking-[-0.015em]"
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
            className="bg-amber px-8 py-4 text-[0.8125rem] font-medium tracking-[0.18em] text-espresso uppercase transition-colors hover:bg-amber-light"
          >
            Reserve your chair
          </Link>
          <a
            href="#services"
            className="border-b border-amber pb-1.5 text-[0.8125rem] tracking-[0.18em] uppercase transition-colors hover:text-amber"
          >
            View services
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-ivory/10 pt-8">
          <dl className="flex flex-wrap items-center gap-12">
            <div>
              <dt className="sr-only">Google rating</dt>
              <dd className="font-display text-[2.125rem] leading-none">
                4.9
                <span aria-hidden="true" className="ml-2 text-lg text-amber">
                  ★★★★★
                </span>
              </dd>
              <dd className="mt-1 text-[0.8125rem] text-stone">
                600+ Google reviews
              </dd>
            </div>
            <div>
              <dt className="sr-only">Appointment length</dt>
              <dd className="font-display text-[2.125rem] leading-none">
                60 min
              </dd>
              <dd className="mt-1 text-[0.8125rem] text-stone">
                Every appointment
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-3.5 border border-line bg-card/90 px-5 py-4">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[#7cc495]"
            />
            <p>
              <span className="block text-[0.6875rem] tracking-[0.22em] text-stone uppercase">
                Next available
              </span>
              <span className="text-[0.9375rem] font-normal">
                Today, 4:30 PM · with Marcus
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
