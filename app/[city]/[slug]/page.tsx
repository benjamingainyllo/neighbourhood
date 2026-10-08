import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Kicker } from "@/components/Kicker";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticle, getArticles, getCity, getRelatedArticles } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { getSection } from "@/lib/sections";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate, imageSrc, ogImageSrc } from "@/lib/utils";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ city: a.city, slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[city]/[slug]">): Promise<Metadata> {
  const { city, slug } = await params;
  const article = getArticle(city, slug);
  if (!article) return {};
  const base = pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: article.href,
    image: article.heroImage,
    imageAlt: article.heroAlt,
  });
  return {
    ...base,
    authors: [{ name: article.author }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags.map((t) => t.name),
      images: [{ url: ogImageSrc(article.heroImage), width: 1200, height: 630, alt: article.heroAlt }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[city]/[slug]">) {
  const { city: citySlug, slug } = await params;
  const article = getArticle(citySlug, slug);
  const city = getCity(citySlug);
  if (!article || !city) notFound();

  const section = getSection(article.section);
  const content = await renderMdx(article.body, { withAd: true });
  const related = getRelatedArticles(article);
  const adsOn = siteConfig.ads.enabled;

  return (
    <article>
      <JsonLd data={articleJsonLd(article, city.name)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: city.name, path: `/${city.slug}` },
          { name: article.title, path: article.href },
        ])}
      />

      {/* Headline */}
      <Container as="header" className="pt-10 pb-8 text-center md:pt-16 md:pb-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
          <ol className="flex flex-wrap items-center justify-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${city.slug}`} className="hover:text-ink">
                {city.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/section/${article.section}`} className="hover:text-ink">
                {section?.name}
              </Link>
            </li>
          </ol>
        </nav>
        <Kicker city={article.city} section={article.section} sponsored={article.sponsored} linked className="justify-center" />
        <h1 className="mx-auto mt-5 max-w-5xl font-serif text-[2.5rem] leading-[1.04] tracking-[-0.025em] text-balance md:text-6xl lg:text-7xl">
          {article.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty md:text-xl">
          {article.excerpt}
        </p>
        <p className="mt-6 text-sm text-muted">
          Words by <span className="text-ink">{article.author}</span>
          <span aria-hidden className="mx-2">
            ·
          </span>
          <time dateTime={article.date} className="whitespace-nowrap">
            {formatDate(article.date)}
          </time>
          <span aria-hidden className="mx-2">
            ·
          </span>
          <span className="whitespace-nowrap">{article.readingTime} min read</span>
        </p>
        {article.sponsored && (
          <p className="mx-auto mt-6 max-w-xl border-y border-line py-3 text-xs leading-relaxed text-muted">
            <strong className="font-semibold text-ink">Partnership.</strong> This story was produced in partnership with a
            brand. Our editors chose what to feature and wrote every word.
          </p>
        )}
      </Container>

      {/* Hero photo */}
      <figure className="mx-auto max-w-[1600px] lg:px-10">
        <div className="relative aspect-[4/5] bg-paper-deep sm:aspect-[3/2] lg:aspect-[16/9]">
          <Image
            src={imageSrc(article.heroImage)}
            alt={article.heroAlt}
            fill
            priority
            sizes="(min-width: 1600px) 1520px, (min-width: 1024px) calc(100vw - 80px), 100vw"
            className="object-cover"
          />
        </div>
        {(article.heroCaption || article.photoCredit) && (
          <figcaption className="mx-auto mt-3 max-w-[1320px] px-4 text-[0.8125rem] leading-snug text-muted sm:px-6 lg:px-0">
            {article.heroCaption} {article.photoCredit && <span className="italic">{article.photoCredit}</span>}
          </figcaption>
        )}
      </figure>

      {/* Body + desktop sidebar */}
      <Container className="mt-12 md:mt-16">
        <div className={adsOn ? "lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12" : ""}>
          <div className="mx-auto w-full max-w-[680px]">
            <div className="article-body">{content}</div>

            {article.tags.length > 0 && (
              <div className="mt-14 border-t border-line pt-6">
                <p className="label text-muted">Filed under</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <li key={tag.slug}>
                      <Link
                        href={`/tag/${tag.slug}`}
                        className="inline-block border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AdSlot placement="endOfArticle" className="mt-14" />
          </div>

          {adsOn && (
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <AdSlot placement="sidebar" />
              </div>
            </div>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <Container as="section" className="mt-24 md:mt-32">
          <SectionHeading title="More stories" href={`/${city.slug}`} linkLabel={`More from ${city.name}`} />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.href} article={a} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
