import type { ReactNode } from "react";

/** A large quote to break up long articles: <PullQuote cite="Name">Quote text</PullQuote> */
export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="!my-14 border-y border-ink py-8 text-center">
      <blockquote className="!border-0 !p-0 font-serif text-[1.75rem] leading-[1.25] tracking-[-0.01em] text-ink not-italic text-balance md:text-[2.125rem] [&>p]:!m-0 [&>p]:![font-size:inherit] [&>p]:![line-height:inherit]">
        {children}
      </blockquote>
      {cite && <figcaption className="label mt-5 text-muted">{cite}</figcaption>}
    </figure>
  );
}
