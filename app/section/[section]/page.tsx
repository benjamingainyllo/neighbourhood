import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getArticlesBySection } from "@/lib/content";
import { getSection, sections } from "@/lib/sections";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/section/[section]">): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return pageMetadata({ title: section.name, description: section.description, path: `/section/${section.slug}` });
}

export default async function SectionPage({ params }: PageProps<"/section/[section]">) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const articles = getArticlesBySection(section.slug);
  const [lead, ...rest] = articles;
  const portrait = section.slug === "people" || section.slug === "photography";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: section.name, path: `/section/${section.slug}` },
        ])}
      />
      <PageHeader eyebrow="Section" title={section.name} intro={section.description} />
      <Container>
        {articles.length === 0 ? (
          <p className="border-t border-ink pt-6 text-ink-soft">New stories are coming soon.</p>
        ) : (
          <div className="border-t border-ink pt-10">
            {lead && (
              <div className="mb-14">
                <ArticleCard article={lead} ratio="wide" size="lg" showExcerpt priority sizes="(min-width: 1320px) 1240px, 100vw" />
              </div>
            )}
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.href} article={a} ratio={portrait ? "portrait" : "landscape"} showExcerpt />
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
