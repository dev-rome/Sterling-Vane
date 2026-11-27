import Link from "next/link";
import { shop } from "@/data/shop";

const footerLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#barbers", label: "Barbers" },
  { href: "/#shop", label: "Shop" },
  { href: "/book", label: "Book an appointment" },
];

export function SiteFooter() {
  return (
    <footer id="visit" className="border-t border-line">
      <div className="mx-auto grid max-w-site gap-12 px-5 pt-20 pb-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <p className="font-display text-[2rem] font-medium">
            Sterling <em className="text-amber">&amp;</em> Vane
          </p>
          <p className="text-[0.9375rem] text-stone">{shop.tagline}</p>
        </div>

        <div>
          <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.26em] text-amber uppercase">
            Visit
          </h2>
          <address className="text-[0.9375rem] leading-relaxed text-stone not-italic">
            {shop.address.area}
            <br />
            {shop.address.city}, {shop.address.region} {shop.address.postalCode}
            <br />
            <a
              href={shop.phone.href}
              className="transition-colors hover:text-amber"
            >
              {shop.phone.display}
            </a>
            <br />
            <a
              href={`mailto:${shop.email}`}
              className="transition-colors hover:text-amber"
            >
              {shop.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.26em] text-amber uppercase">
            Hours
          </h2>
          <dl className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-2 text-[0.9375rem]">
            {shop.hours.map((row) => (
              <div key={row.days} className="contents">
                <dt className="text-stone">{row.days}</dt>
                <dd>{row.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.26em] text-amber uppercase">
            Explore
          </h2>
          <ul className="flex flex-col gap-2 text-[0.9375rem]">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-stone transition-colors hover:text-amber"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-site px-5 pb-14 md:px-8">
        <iframe
          src={shop.mapEmbedUrl}
          title="Map showing Sterling & Vane in Fulton Market, Chicago"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full border border-line filter-[grayscale(1)_invert(0.9)_contrast(0.9)]"
        />
      </div>

      <div className="mx-auto flex max-w-site flex-col gap-3 border-t border-line px-5 py-8 text-xs text-stone md:flex-row md:justify-between md:px-8">
        <p>© 2026 Sterling &amp; Vane · Concept project</p>
        <p>
          Photography: Unsplash (Nathon Oski, Fabio Alves, Tony Flood),
          Magnific, StockCake
        </p>
      </div>
    </footer>
  );
}
