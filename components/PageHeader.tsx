import type { ReactNode } from "react";
import { Container } from "./Container";

/** Title block at the top of listing and info pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-12 pb-10 md:pt-20 md:pb-14">
      {eyebrow && <p className="label text-accent">{eyebrow}</p>}
      <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-balance md:text-7xl">
        {title}
      </h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">{intro}</p>}
      {children}
    </Container>
  );
}
