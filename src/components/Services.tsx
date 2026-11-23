import Link from "next/link";
import { services } from "@/data/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { formatPrice } from "@/lib/format";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-y border-line bg-walnut"
    >
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto mb-16 flex max-w-136 flex-col items-center gap-4 text-center md:mb-20">
          <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
            The menu
          </p>
          <h2
            id="services-heading"
            className="font-display text-[clamp(2.5rem,1.75rem+3vw,4rem)] leading-none font-normal"
          >
            Signature <em className="text-amber">Services</em>
          </h2>
          <p className="text-stone">
            Every service includes a consultation, hot-towel finish and a
            complimentary drink.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.slug}
              className={`relative flex flex-col gap-3.5 border bg-card p-8 transition-colors hover:border-amber ${
                service.featured ? "border-amber" : "border-line"
              }`}
            >
              {service.featured && (
                <span className="absolute top-0 right-0 bg-amber px-3 py-1.5 text-[0.625rem] font-medium tracking-[0.2em] text-espresso uppercase">
                  Most booked
                </span>
              )}
              <ServiceIcon name={service.icon} />
              <h3 className="font-display text-[1.875rem] leading-tight font-medium">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="after:absolute after:inset-0"
                >
                  {service.name}
                </Link>
              </h3>
              <p className="flex-1 text-[0.9375rem] text-stone">
                {service.description}
              </p>
              <div className="flex items-center justify-between border-t border-line pt-5">
                <p>
                  <span className="font-display text-[1.875rem] text-amber">
                    {formatPrice.format(service.price)}
                  </span>
                  <span className="ml-2.5 text-[0.8125rem] text-stone">
                    {service.duration} min
                  </span>
                </p>
                <span
                  aria-hidden="true"
                  className={`flex size-11 items-center justify-center ${
                    service.featured
                      ? "bg-amber text-espresso"
                      : "border border-line"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
