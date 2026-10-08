import { Suspense } from "react";
import { Container } from "@/components/Container";
import { SearchClient, type SearchItem } from "@/components/SearchClient";
import { getArticles, getCity } from "@/lib/content";
import { getSection } from "@/lib/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Search",
    description: "Search Neighbourhood stories by city, section, place or topic.",
    path: "/search",
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  const items: SearchItem[] = getArticles().map((a) => ({
    title: a.title,
    excerpt: a.excerpt,
    href: a.href,
    city: getCity(a.city)?.name ?? a.city,
    section: getSection(a.section)?.name ?? a.section,
    tags: a.tags.map((t) => t.name),
    author: a.author,
    date: a.date,
    image: a.heroImage,
    imageAlt: a.heroAlt,
    sponsored: a.sponsored,
  }));

  return (
    <Container className="pt-12 md:pt-20">
      <p className="label text-accent">Search</p>
      <h1 className="mt-3 font-serif text-5xl tracking-[-0.02em] md:text-7xl">Find a story</h1>
      <Suspense fallback={<div className="mt-10 h-16 border-b border-ink" />}>
        <SearchClient items={items} />
      </Suspense>
    </Container>
  );
}
