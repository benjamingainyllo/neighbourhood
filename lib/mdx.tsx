import type { ComponentProps } from "react";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateBox } from "@/components/mdx/AffiliateBox";
import { Figure } from "@/components/mdx/Figure";
import { PullQuote } from "@/components/mdx/PullQuote";

/*
 * Turns the Markdown/MDX body of an article into the page.
 * Components you can use inside any .mdx file: <Figure>, <AffiliateBox>, <PullQuote>.
 */

type MdNode = { type: string; children?: MdNode[]; value?: string; [key: string]: unknown };

/**
 * 1. A photo on its own line becomes a full <Figure> (not a photo inside a paragraph).
 * 2. When `withAd` is on, an in-article ad slot is placed after the 3rd paragraph.
 */
function remarkArticle(options: { withAd: boolean }) {
  return () => (tree: MdNode) => {
    const children = tree.children ?? [];
    const out: MdNode[] = [];
    let paragraphs = 0;
    let adPlaced = false;

    children.forEach((node, index) => {
      if (node.type === "paragraph") {
        const parts = (node.children ?? []).filter((c) => !(c.type === "text" && !c.value?.trim()));
        if (parts.length > 0 && parts.every((c) => c.type === "image")) {
          out.push(...parts);
          return;
        }
        out.push(node);
        paragraphs += 1;
        if (options.withAd && !adPlaced && paragraphs === 3 && index < children.length - 1) {
          out.push({ type: "mdxJsxFlowElement", name: "InArticleAd", attributes: [], children: [] });
          adPlaced = true;
        }
        return;
      }
      out.push(node);
    });

    tree.children = out;
  };
}

const components = {
  Figure,
  AffiliateBox,
  PullQuote,
  InArticleAd: () => <AdSlot placement="inArticle" />,
  // Markdown images: ![Alt text](https://... "Optional caption")
  img: ({ src, alt, title }: ComponentProps<"img">) =>
    typeof src === "string" ? <Figure src={src} alt={alt ?? ""} caption={title ?? undefined} /> : null,
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    ),
};

export async function renderMdx(source: string, { withAd = false }: { withAd?: boolean } = {}) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: { remarkPlugins: [remarkArticle({ withAd })] },
    },
  });
  return content;
}
