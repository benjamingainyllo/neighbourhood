"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate, imageSrc } from "@/lib/utils";

export type SearchItem = {
  title: string;
  excerpt: string;
  href: string;
  city: string;
  section: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  sponsored: boolean;
};

function normalise(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function SearchClient({ items }: { items: SearchItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const terms = normalise(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return items
      .map((item) => {
        const title = normalise(item.title);
        const meta = normalise([item.city, item.section, item.tags.join(" "), item.author].join(" "));
        const body = normalise(item.excerpt);
        let score = 0;
        for (const term of terms) {
          if (title.includes(term)) score += 5;
          else if (meta.includes(term)) score += 3;
          else if (body.includes(term)) score += 1;
          else return null; // every word must match somewhere
        }
        return { item, score };
      })
      .filter((r): r is { item: SearchItem; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [items, query]);

  function update(value: string) {
    setQuery(value);
    const url = value ? `${pathname}?q=${encodeURIComponent(value)}` : pathname;
    router.replace(url, { scroll: false });
  }

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-10 border-b border-ink">
        <label htmlFor="search-input" className="sr-only">
          Search stories
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder="Try “Lagos”, “coffee” or “hotels”"
          autoFocus
          className="w-full bg-transparent py-4 font-serif text-2xl placeholder:text-muted focus:outline-none md:text-4xl"
        />
      </form>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {query.trim()
          ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query.trim()}”`
          : `Search ${items.length} stories by city, section, place or topic.`}
      </p>

      <ul className="mt-10 divide-y divide-line">
        {results.map((item) => (
          <li key={item.href} className="group py-6 first:pt-0">
            <Link href={item.href} className="grid grid-cols-[96px_1fr] gap-5 sm:grid-cols-[180px_1fr] sm:gap-8">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
                <Image src={imageSrc(item.image, 600)} alt={item.imageAlt} fill sizes="180px" className="object-cover" />
              </div>
              <div>
                <p className="label text-muted">
                  {item.sponsored && <span className="mr-2 border border-ink px-1.5 py-0.5 text-ink">Partnership</span>}
                  <span className="text-accent">{item.city}</span> · {item.section}
                </p>
                <h2 className="mt-2 font-serif text-xl leading-snug md:text-2xl">
                  <span className="link-underline">{item.title}</span>
                </h2>
                <p className="mt-2 hidden text-sm leading-relaxed text-ink-soft sm:block">{item.excerpt}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(item.date)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
