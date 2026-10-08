import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getSection, sections, type SectionSlug } from "./sections";
import { slugify } from "./utils";

/*
 * This file reads everything inside the /content folder:
 *   content/articles/<city>/<article>.mdx  -> stories
 *   content/cities/<city>.md                -> city pages
 *   content/pages/<page>.mdx                -> About, Contact, Privacy, etc.
 *
 * If an article is missing a required field, the site will refuse to build
 * and print a message telling you exactly which file and which field to fix.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const CITIES_DIR = path.join(CONTENT_DIR, "cities");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");

export type Tag = { name: string; slug: string };

export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  city: string;
  section: SectionSlug;
  tags: Tag[];
  author: string;
  date: string;
  heroImage: string;
  heroAlt: string;
  heroCaption?: string;
  photoCredit?: string;
  sponsored: boolean;
  featured: boolean;
  body: string;
  readingTime: number;
  href: string;
};

export type City = {
  name: string;
  slug: string;
  country: string;
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  photoCredit?: string;
  order: number;
  facts: { label: string; value: string }[];
  body: string;
};

export type StaticPage = {
  slug: string;
  title: string;
  description: string;
  updated?: string;
  body: string;
};

const isProd = process.env.NODE_ENV === "production";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

function fail(file: string, message: string): never {
  const rel = path.relative(process.cwd(), file);
  throw new Error(`\n\n  Problem in ${rel}:\n  ${message}\n`);
}

function requireString(file: string, data: Record<string, unknown>, field: string): string {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `The "${field}:" field is missing or empty.`);
  }
  return value.trim();
}

function toDateString(file: string, value: unknown): string {
  // YAML turns 2026-09-12 into a Date object; keep it as "2026-09-12".
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && !isNaN(Date.parse(value))) return value;
  fail(file, `The "date:" field must look like 2026-09-12.`);
}

/** Read a content file, with a friendly message if the top section is badly formatted. */
function readFile(file: string) {
  try {
    return matter(fs.readFileSync(file, "utf8"));
  } catch (err) {
    const detail = err instanceof Error ? err.message.split("\n")[0] : String(err);
    fail(
      file,
      `The details section at the top (between the --- lines) has a formatting problem.\n` +
        `  Most common cause: a value containing a colon followed by a space. Wrap it in double quotes, e.g.\n` +
        `    title: "My Kigali: a love letter"\n` +
        `  Technical detail: ${detail}`,
    );
  }
}

function wordCount(text: string): number {
  return text
    .replace(/<[A-Z][^<>]*\/>/g, " ") // photo and box components
    .replace(/<\/?[A-Za-z][^<>]*>/g, " ")
    .replace(/[#*_>`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

// ---------- Cities ----------

let citiesCache: City[] | null = null;

export function getCities(): City[] {
  if (citiesCache && isProd) return citiesCache;

  const cities = walk(CITIES_DIR).map((file): City => {
    const { data, content } = readFile(file);
    const slug = path.basename(file).replace(/\.mdx?$/, "");
    const facts = Array.isArray(data.facts)
      ? data.facts
          .filter((f: unknown): f is { label: string; value: string } =>
            Boolean(f && typeof f === "object" && "label" in f && "value" in f),
          )
          .map((f) => ({ label: String(f.label), value: String(f.value) }))
      : [];

    return {
      slug,
      name: requireString(file, data, "name"),
      country: requireString(file, data, "country"),
      excerpt: requireString(file, data, "excerpt"),
      heroImage: requireString(file, data, "heroImage"),
      heroAlt: typeof data.heroAlt === "string" ? data.heroAlt : `${data.name}, ${data.country}`,
      photoCredit: typeof data.photoCredit === "string" ? data.photoCredit : undefined,
      order: typeof data.order === "number" ? data.order : 999,
      facts,
      body: content.trim(),
    };
  });

  cities.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  citiesCache = cities;
  return cities;
}

export function getCity(slug: string): City | undefined {
  return getCities().find((c) => c.slug === slug);
}

// ---------- Articles ----------

let articlesCache: Article[] | null = null;

export function getArticles(): Article[] {
  if (articlesCache && isProd) return articlesCache;

  const citySlugs = getCities().map((c) => c.slug);
  const seen = new Map<string, string>();

  const articles = walk(ARTICLES_DIR)
    .map((file): Article | null => {
      const { data, content } = readFile(file);

      if (data.draft === true && isProd) return null;

      const title = requireString(file, data, "title");
      const slug = slugify(
        typeof data.slug === "string" && data.slug.trim() ? data.slug : path.basename(file).replace(/\.mdx?$/, ""),
      );
      const city = slugify(requireString(file, data, "city"));
      const section = slugify(requireString(file, data, "section"));

      if (!citySlugs.includes(city)) {
        fail(
          file,
          `The city "${city}" doesn't exist yet. Create content/cities/${city}.md first, or use one of: ${citySlugs.join(", ")}.`,
        );
      }
      if (!getSection(section)) {
        fail(file, `The section "${section}" isn't valid. Use one of: ${sections.map((s) => s.slug).join(", ")}.`);
      }

      const href = `/${city}/${slug}`;
      if (seen.has(href)) {
        fail(file, `Another article already uses the address ${href} (${seen.get(href)}). Change the "slug:" field.`);
      }
      seen.set(href, path.relative(process.cwd(), file));

      const rawTags: unknown[] = Array.isArray(data.tags) ? data.tags : [];
      const tags = rawTags
        .filter((t): t is string => typeof t === "string" && t.trim() !== "")
        .map((t) => ({ name: t.trim(), slug: slugify(t) }));

      return {
        title,
        slug,
        excerpt: requireString(file, data, "excerpt"),
        city,
        section: section as SectionSlug,
        tags,
        author: requireString(file, data, "author"),
        date: toDateString(file, data.date),
        heroImage: requireString(file, data, "heroImage"),
        heroAlt: typeof data.heroAlt === "string" && data.heroAlt.trim() ? data.heroAlt : title,
        heroCaption: typeof data.heroCaption === "string" ? data.heroCaption : undefined,
        photoCredit: typeof data.photoCredit === "string" ? data.photoCredit : undefined,
        sponsored: data.sponsored === true,
        featured: data.featured === true,
        body: content,
        readingTime: Math.max(1, Math.round(wordCount(content) / 225)),
        href,
      };
    })
    .filter((a): a is Article => a !== null);

  // Newest first
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  articlesCache = articles;
  return articles;
}

export function getArticle(city: string, slug: string): Article | undefined {
  return getArticles().find((a) => a.city === city && a.slug === slug);
}

export function getArticlesByCity(city: string): Article[] {
  return getArticles().filter((a) => a.city === city);
}

export function getArticlesBySection(section: string): Article[] {
  return getArticles().filter((a) => a.section === section);
}

export function getArticlesByTag(tagSlug: string): Article[] {
  return getArticles().filter((a) => a.tags.some((t) => t.slug === tagSlug));
}

export function getAllTags(): (Tag & { count: number })[] {
  const map = new Map<string, Tag & { count: number }>();
  for (const article of getArticles()) {
    for (const tag of article.tags) {
      const existing = map.get(tag.slug);
      if (existing) existing.count += 1;
      else map.set(tag.slug, { ...tag, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** The homepage lead story: the newest article marked `featured: true`, otherwise the newest article. */
export function getFeaturedArticle(): Article | undefined {
  const all = getArticles();
  return all.find((a) => a.featured) ?? all[0];
}

/** Stories to show under an article: same city or shared tags first, then same section. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tagSlugs = new Set(article.tags.map((t) => t.slug));
  return getArticles()
    .filter((a) => a.href !== article.href)
    .map((a) => {
      let score = 0;
      if (a.city === article.city) score += 3;
      if (a.section === article.section) score += 2;
      score += a.tags.filter((t) => tagSlugs.has(t.slug)).length;
      return { a, score };
    })
    .sort((x, y) => y.score - x.score || (x.a.date < y.a.date ? 1 : -1))
    .slice(0, limit)
    .map(({ a }) => a);
}

// ---------- Static pages (About, Contact, ...) ----------

export function getPage(slug: string): StaticPage {
  const file = path.join(PAGES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) throw new Error(`Missing page file: content/pages/${slug}.mdx`);
  const { data, content } = readFile(file);
  return {
    slug,
    title: requireString(file, data, "title"),
    description: requireString(file, data, "description"),
    updated: data.updated ? toDateString(file, data.updated) : undefined,
    body: content,
  };
}
