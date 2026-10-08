import type { MetadataRoute } from "next";
import { getAllTags, getArticles, getCities } from "@/lib/content";
import { sections } from "@/lib/sections";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const articles = getArticles();
  const latest = articles[0]?.date;

  const pages = ["", "/city-guides", "/about", "/contact", "/partner-with-us", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: path === "" || path === "/city-guides" ? latest : undefined,
  }));

  return [
    ...pages,
    ...getCities().map((c) => ({ url: `${base}/${c.slug}`, lastModified: articles.find((a) => a.city === c.slug)?.date })),
    ...sections.map((s) => ({ url: `${base}/section/${s.slug}` })),
    ...articles.map((a) => ({
      url: `${base}${a.href}`,
      lastModified: a.date,
      images: [a.heroImage],
    })),
    ...getAllTags().map((t) => ({ url: `${base}/tag/${t.slug}` })),
  ];
}
