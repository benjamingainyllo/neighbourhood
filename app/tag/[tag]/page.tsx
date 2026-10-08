import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getAllTags, getArticlesByTag } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

function findTag(slug: string) {
  return getAllTags().find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/tag/[tag]">): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = findTag(slug);
  if (!tag) return {};
  return pageMetadata({
    title: `${tag.name}: stories tagged ${tag.name}`,
    description: `Every Neighbourhood story about ${tag.name.toLowerCase()} in African cities.`,
    path: `/tag/${tag.slug}`,
  });
}

export default async function TagPage({ params }: PageProps<"/tag/[tag]">) {
  const { tag: slug } = await params;
  const tag = findTag(slug);
  if (!tag) notFound();
  const articles = getArticlesByTag(tag.slug);
  const otherTags = getAllTags().filter((t) => t.slug !== tag.slug).slice(0, 16);

  return (
    <>
      <PageHeader
        eyebrow="Tag"
        title={tag.name}
        intro={`${articles.length} ${articles.length === 1 ? "story" : "stories"}`}
      />
      <Container>
        <div className="grid gap-x-8 gap-y-12 border-t border-ink pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.href} article={a} showExcerpt />
          ))}
        </div>

        {otherTags.length > 0 && (
          <div className="mt-20 border-t border-line pt-6">
            <p className="label text-muted">More topics</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherTags.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tag/${t.slug}`}
                    className="inline-block border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  );
}
