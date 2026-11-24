import Image from "next/image";
import Link from "next/link";
import ctaImage from "../../public/images/cta.jpg";

export function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate flex min-h-140 items-center justify-center overflow-hidden text-center"
    >
      <Image
        src={ctaImage}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-espresso/75"
      />

      <div className="flex flex-col items-center gap-7 px-5 py-24">
        <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
          By appointment
        </p>
        <h2
          id="cta-heading"
          className="font-display text-[clamp(3rem,2rem+4vw,5rem)] leading-none font-normal"
        >
          Your chair
          <br />
          <em className="text-amber">is waiting.</em>
        </h2>
        <Link
          href="/book"
          className="bg-amber px-9 py-5 text-[0.8125rem] font-medium tracking-[0.18em] text-espresso uppercase transition-colors hover:bg-amber-light"
        >
          Reserve your chair
        </Link>
      </div>
    </section>
  );
}
