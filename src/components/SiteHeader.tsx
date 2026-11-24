import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#story", label: "Our Story" },
  { href: "/#barbers", label: "Barbers" },
  { href: "/#shop", label: "Shop" },
  { href: "/#visit", label: "Visit" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={`${overlay ? "absolute inset-x-0 top-0" : "relative"} z-50 border-b border-ivory/10`}
    >
      <div className="mx-auto flex max-w-site items-center justify-between gap-2 px-5 py-5 sm:gap-4 md:gap-6 md:px-8">
        <Link
          href="/"
          className="font-display text-xl font-medium whitespace-nowrap md:text-2xl"
        >
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/book"
            className="bg-amber px-3 py-3 text-xs font-medium tracking-[0.12em] whitespace-nowrap text-espresso uppercase transition-colors hover:bg-amber-light sm:px-4 sm:tracking-[0.18em] md:px-5"
          >
            Book now
          </Link>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
