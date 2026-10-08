import Link from "next/link";
import { getCities } from "@/lib/content";
import { sections } from "@/lib/sections";
import { siteConfig } from "@/site.config";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  const cities = getCities().map((c) => ({ slug: c.slug, name: c.name }));
  const nav = sections.map((s) => ({
    name: s.name,
    href: s.slug === "city-guides" ? "/city-guides" : `/section/${s.slug}`,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper lg:static lg:border-b-0">
      {/* Top strip (desktop) */}
      <div className="hidden border-b border-line lg:block">
        <Container className="flex h-9 items-center justify-between text-xs text-muted">
          <p>{siteConfig.tagline}</p>
          <nav aria-label="Secondary" className="flex items-center gap-6">
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/partner-with-us" className="hover:text-ink">
              Partner With Us
            </Link>
            <Link href="/search" className="hover:text-ink">
              Search
            </Link>
            <Link href="#newsletter" className="font-medium text-ink hover:text-accent">
              Subscribe
            </Link>
          </nav>
        </Container>
      </div>

      {/* Masthead */}
      <Container className="flex h-16 items-center justify-between lg:h-auto lg:flex-col lg:pt-9 lg:pb-0">
        <Link
          href="/"
          className="font-serif text-[1.75rem] leading-none tracking-[-0.02em] lg:text-[4.25rem]"
          aria-label={`${siteConfig.name}, home`}
        >
          {siteConfig.name}
        </Link>
        <MobileMenu nav={nav} cities={cities} />

        {/* Section navigation (desktop) */}
        <nav aria-label="Sections" className="mt-7 hidden w-full border-y border-ink lg:block">
          <ul className="flex items-center justify-center gap-10 py-3.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label text-ink transition-colors hover:text-accent">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
