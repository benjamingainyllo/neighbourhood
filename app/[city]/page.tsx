import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticlesByCity, getCities, getCity } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { sections } from "@/lib/sections";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { imageSrc } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[city]">): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return pageMetadata({
    title: `${city.name} City Guide: where to eat, stay and explore`,
    description: city.excerpt,
    path: `/${city.slug}`,
    image: city.heroImage,
    imageAlt: city.heroAlt,
  });
}

export default async function CityPage({ params }: PageProps<"/[city]">) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const articles = getArticlesByCity(city.slug);
  const [lead, ...rest] = articles;
  const intro = city.body ? await renderMdx(city.body) : null;
  const sectionsHere = sections.filter((s) => articles.some((a) => a.section === s.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "City Guides", path: "/city-guides" },
          { name: city.name, path: `/${city.slug}` },
        ])}
      />

      {/* City hero */}
      <section className="relative">
        <div className="relative h-[70svh] min-h-[420px] max-h-[760px] bg-ink">
          <Image
            src={imageSrc(city.heroImage)}
            alt={city.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/0" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 text-paper md:pb-16">
            <p className="label opacity-80">City Guide · {city.country}</p>
            <h1 className="mt-3 font-serif text-6xl leading-none tracking-[-0.03em] md:text-8xl lg:text-9xl">{city.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85 text-pretty">{city.excerpt}</p>
          </Container>
        </div>
        {city.photoCredit && (
          <Container>
            <p className="mt-2 text-right text-xs text-muted italic">{city.photoCredit}</p>
          </Container>
        )}
      </section>

      {/* Intro + facts */}
      <Container className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
        {intro && <div className="article-body lg:col-span-7">{intro}</div>}
        {city.facts.length > 0 && (
          <aside className="lg:col-span-4 lg:col-start-9">
            <p className="label border-b border-ink pb-3">{city.name} at a glance</p>
            <dl>
              {city.facts.map((fact) => (
                <div key={fact.label} className="border-b border-line py-3.5">
                  <dt className="text-xs text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-[0.9375rem] text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </Container>

      {/* Stories */}
      <Container as="section" className="mt-20 md:mt-28">
        <SectionHeading
          title={`Stories from ${city.name}`}
          description={sectionsHere.length ? sectionsHere.map((s) => s.name).join(" · ") : undefined}
        />
        {articles.length === 0 ? (
          <p className="text-ink-soft">Our first {city.name} stories are on their way.</p>
        ) : (
          <>
            {lead && (
              <div className="mb-14">
                <ArticleCard article={lead} ratio="wide" size="lg" showExcerpt sizes="(min-width: 1320px) 1240px, 100vw" />
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.href} article={a} showExcerpt />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
