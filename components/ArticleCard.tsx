import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { formatDate, imageSrc } from "@/lib/utils";
import { Kicker } from "./Kicker";

type Props = {
  article: Article;
  /** Image shape: "landscape" (4:3), "portrait" (4:5) or "wide" (16:9) */
  ratio?: "landscape" | "portrait" | "wide";
  showExcerpt?: boolean;
  size?: "sm" | "md" | "lg";
  sizes?: string;
  priority?: boolean;
};

const ratios = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

const titleSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl md:text-4xl",
};

/** Image-led story card used on every listing page. */
export function ArticleCard({
  article,
  ratio = "landscape",
  showExcerpt = false,
  size = "md",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: Props) {
  return (
    <article className="group">
      <Link href={article.href} className="block">
        <div className={`relative overflow-hidden bg-paper-deep ${ratios[ratio]}`}>
          <Image
            src={imageSrc(article.heroImage, 1600)}
            alt={article.heroAlt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="mt-4">
        <Kicker city={article.city} section={article.section} sponsored={article.sponsored} />
        <h3 className={`mt-2 font-serif leading-[1.15] tracking-[-0.01em] text-balance ${titleSizes[size]}`}>
          <Link href={article.href} className="link-underline">
            {article.title}
          </Link>
        </h3>
        {showExcerpt && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft text-pretty">{article.excerpt}</p>}
        <p className="mt-3 text-xs text-muted">
          <span>Words by {article.author}</span>
          <span aria-hidden className="mx-1.5">
            ·
          </span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
      </div>
    </article>
  );
}

/** Wide side-by-side card, used when a homepage section has a single story. */
export function ArticleCardWide({ article }: { article: Article }) {
  return (
    <article className="group grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
      <Link href={article.href} className="block md:col-span-7">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep md:aspect-[3/2]">
          <Image
            src={imageSrc(article.heroImage, 1800)}
            alt={article.heroAlt}
            fill
            sizes="(min-width: 1320px) 720px, (min-width: 768px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="md:col-span-5">
        <Kicker city={article.city} section={article.section} sponsored={article.sponsored} />
        <h3 className="mt-3 font-serif text-3xl leading-[1.1] tracking-[-0.015em] text-balance md:text-4xl">
          <Link href={article.href} className="link-underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-ink-soft text-pretty">{article.excerpt}</p>
        <p className="mt-4 text-xs text-muted">
          Words by {article.author}
          <span aria-hidden className="mx-1.5">
            ·
          </span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
      </div>
    </article>
  );
}
