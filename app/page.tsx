import Image from "next/image";
import Link from "next/link";
import { ArticleCard, ArticleCardWide } from "@/components/ArticleCard";
import { CityCard } from "@/components/CityCard";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Kicker } from "@/components/Kicker";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticles, getArticlesByCity, getArticlesBySection, getCities, getFeaturedArticle } from "@/lib/content";
import { sections } from "@/lib/sections";
import { formatDate, imageSrc } from "@/lib/utils";
import { siteConfig } from "@/site.config";

// No ad slots on the homepage (by design).
export default function HomePage() {
  const featured = getFeaturedArticle();
  const latest = getArticles()
    .filter((a) => a.href !== featured?.href)
    .slice(0, 3);
  const cities = getCities();

  const sectionBlocks = sections
    .map((section) => ({
      section,
      articles: getArticlesBySection(section.slug).filter((a) => a.href !== featured?.href).slice(0, 3),
    }))
    .filter((block) => block.articles.length > 0);

  const firstBlocks = sectionBlocks.slice(0, 2);
  const restBlocks = sectionBlocks.slice(2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteConfig.url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {featured && (
        <Container as="section" className="pt-6 md:pt-10">
          <h1 className="sr-only">
            {siteConfig.name}: {siteConfig.tagline}
          </h1>
          <article className="group grid gap-6 lg:grid-cols-12 lg:gap-10">
            <Link href={featured.href} className="block lg:col-span-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep sm:aspect-[3/2]">
                <Image
                  src={imageSrc(featured.heroImage)}
                  alt={featured.heroAlt}
                  fill
                  priority
                  sizes="(min-width: 1320px) 840px, (min-width: 1024px) 66vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </Link>
            <div className="flex flex-col lg:col-span-4 lg:justify-end lg:pb-2">
              <Kicker city={featured.city} section={featured.section} sponsored={featured.sponsored} />
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl xl:text-6xl">
                <Link href={featured.href} className="link-underline">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft text-pretty">{featured.excerpt}</p>
              <p className="mt-5 text-xs text-muted">
                Words by {featured.author} <span aria-hidden className="mx-1.5">·</span>
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              </p>
            </div>
          </article>
        </Container>
      )}

      {/* Mission statement */}
      <Container className="py-16 md:py-24">
        <p className="mx-auto max-w-3xl text-center font-serif text-2xl leading-snug text-ink text-balance md:text-[2.125rem]">
          A magazine for creative travellers in African cities: the places, people and neighbourhoods worth crossing an
          ocean for.
        </p>
      </Container>

      {latest.length > 0 && (
        <Container as="section">
          <SectionHeading title="Latest" />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.href} article={a} showExcerpt />
            ))}
          </div>
        </Container>
      )}

      {firstBlocks.map(({ section, articles }) => (
        <SectionBlock key={section.slug} section={section} articles={articles} />
      ))}

      <div className="mt-24 md:mt-32">
        <Newsletter variant="feature" />
      </div>

      {restBlocks.map(({ section, articles }) => (
        <SectionBlock key={section.slug} section={section} articles={articles} />
      ))}

      {/* City directory */}
      <Container as="section" className="mt-24 md:mt-32">
        <SectionHeading
          title="Neighbourhood City Guides"
          description="Every city we cover, with guides written by the people who live there."
          href="/city-guides"
          linkLabel="All cities"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} count={getArticlesByCity(city.slug).length} />
          ))}
          <div className="flex aspect-[3/4] flex-col justify-end border border-dashed border-line p-4 md:p-5">
            <p className="label text-muted">Coming soon</p>
            <p className="mt-1 font-serif text-2xl leading-tight text-ink-soft italic">Accra, Cape Town, Dakar&hellip;</p>
          </div>
        </div>
      </Container>
    </>
  );
}

function SectionBlock({
  section,
  articles,
}: {
  section: (typeof sections)[number];
  articles: ReturnType<typeof getArticles>;
}) {
  const href = section.slug === "city-guides" ? "/city-guides" : `/section/${section.slug}`;
  const portrait = section.slug === "people" || section.slug === "photography";
  return (
    <Container as="section" className="mt-24 md:mt-32">
      <SectionHeading title={section.name} description={section.description} href={href} />
      {articles.length === 1 ? (
        <ArticleCardWide article={articles[0]} />
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.href} article={a} ratio={portrait ? "portrait" : "landscape"} />
          ))}
        </div>
      )}
    </Container>
  );
}
