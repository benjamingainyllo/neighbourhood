import { Container } from "./Container";
import { getPage } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** Renders a page from content/pages/<slug>.mdx */
export async function StaticPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  const content = await renderMdx(page.body);
  return (
    <Container className="pt-12 md:pt-20">
      <div className="mx-auto max-w-[680px]">
        <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.02em] text-balance md:text-6xl">{page.title}</h1>
        {page.updated && <p className="mt-4 text-sm text-muted">Last updated {formatDate(page.updated)}</p>}
        <div className="article-body mt-10 border-t border-ink pt-10">{content}</div>
      </div>
    </Container>
  );
}
