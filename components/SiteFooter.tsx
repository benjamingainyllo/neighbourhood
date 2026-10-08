import Link from "next/link";
import { getCities } from "@/lib/content";
import { sections } from "@/lib/sections";
import { siteConfig } from "@/site.config";
import { Container } from "./Container";

export function SiteFooter() {
  const cities = getCities();
  const social = Object.entries(siteConfig.social).filter(([, url]) => url);
  const socialNames: Record<string, string> = { instagram: "Instagram", x: "X", linkedin: "LinkedIn" };

  return (
    <footer className="mt-16 bg-ink text-paper md:mt-20">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="font-serif text-4xl tracking-[-0.02em] md:text-5xl">
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">{siteConfig.description}</p>
          </div>

          <FooterList
            title="Sections"
            items={sections.map((s) => ({
              name: s.name,
              href: s.slug === "city-guides" ? "/city-guides" : `/section/${s.slug}`,
            }))}
          />
          <FooterList title="Cities" items={cities.map((c) => ({ name: c.name, href: `/${c.slug}` }))} />
          <FooterList
            title="Neighbourhood"
            items={[
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
              { name: "Partner With Us", href: "/partner-with-us" },
              { name: "Search", href: "/search" },
              ...social.map(([key, url]) => ({ name: socialNames[key] ?? key, href: url, external: true })),
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/20 pt-6 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-paper">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-paper">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-paper">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: { name: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="md:col-span-2 md:col-start-auto">
      <p className="label text-paper/50">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href + item.name}>
            {item.external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {item.name}
              </a>
            ) : (
              <Link href={item.href} className="hover:text-accent">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
