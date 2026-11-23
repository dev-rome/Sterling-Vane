import Image from "next/image";
import Link from "next/link";
import { barbers } from "@/data/barbers";

export function Barbers() {
  return (
    <section
      id="barbers"
      aria-labelledby="barbers-heading"
      className="mx-auto max-w-site px-5 py-24 md:px-8 md:py-36"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div className="flex flex-col gap-4">
          <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
            The craftsmen
          </p>
          <h2
            id="barbers-heading"
            className="font-display text-[clamp(2.5rem,1.75rem+3vw,4rem)] leading-none font-normal"
          >
            Masters of <em className="text-amber">the chair</em>
          </h2>
        </div>
        <Link
          href="/book"
          className="border-b border-amber pb-1.5 text-[0.8125rem] tracking-[0.18em] uppercase transition-colors hover:text-amber"
        >
          Book a barber
        </Link>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <li
            key={barber.slug}
            className="group relative flex h-125 flex-col justify-end overflow-hidden border border-line p-7"
          >
            <Image
              src={barber.image}
              alt={barber.imageAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
              className={`-z-20 object-cover transition-transform duration-700 group-hover:scale-105 ${barber.imagePosition}`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-espresso via-espresso/40 to-transparent"
            />

            <p className="text-[0.6875rem] tracking-[0.22em] text-amber uppercase">
              {barber.title} · {barber.years} yrs
            </p>
            <h3 className="mt-1.5 mb-1 font-display text-[2.125rem] leading-none font-medium">
              <Link
                href={`/book?barber=${barber.slug}`}
                className="after:absolute after:inset-0"
              >
                {barber.name}
              </Link>
            </h3>
            <p className="text-sm text-stone">{barber.specialty}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
