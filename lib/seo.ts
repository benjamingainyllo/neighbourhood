import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import type { Article } from "./content";
import { absoluteUrl, ogImageSrc } from "./utils";

/** Standard title/description/social-preview tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const images = image ? [{ url: ogImageSrc(image), width: 1200, height: 630, alt: imageAlt ?? title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: siteConfig.name, images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export function articleJsonLd(article: Article, cityName: string) {
  const url = absoluteUrl(article.href, siteConfig.url);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [ogImageSrc(article.heroImage)],
    datePublished: article.date,
    dateModified: article.date,
    author: [{ "@type": "Person", name: article.author }],
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.section,
    keywords: article.tags.map((t) => t.name).join(", "),
    contentLocation: { "@type": "City", name: cityName },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteConfig.url),
    })),
  };
}
