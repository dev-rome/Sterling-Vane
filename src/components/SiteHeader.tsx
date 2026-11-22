import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#story", label: "Our Story" },
  { href: "#barbers", label: "Barbers" },
  { href: "#shop", label: "Shop" },
  { href: "#visit", label: "Visit" },
];

export function SiteHeader() {
  return (
    <header className="relative border-b border-ivory/10">
      <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-5 py-5 md:px-8">
        <Link href="/" className="font-display text-2xl font-medium">
          Sterling <em className="text-amber">&amp;</em> Vane
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-9 text-sm font-normal tracking-[0.06em]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-amber"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="bg-amber px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-amber-light"
          >
            Book now
          </Link>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
