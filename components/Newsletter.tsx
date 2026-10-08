import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";

/** Newsletter sign-up block. "feature" is the large homepage version. */
export function Newsletter({ variant = "strip", id }: { variant?: "feature" | "strip"; id?: string }) {
  if (variant === "feature") {
    return (
      <section id={id} className="bg-ink text-paper scroll-mt-20">
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <p className="label text-paper/60">The Neighbourhood Letter</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-balance md:text-6xl">
              Join us for the journey
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="mb-6 leading-relaxed text-paper/80">
              One letter a fortnight: new city guides, the people we met, and the places we&rsquo;d book again. No noise,
              unsubscribe any time.
            </p>
            <NewsletterForm tone="dark" source="home-feature" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-20">
      <Container>
        <div className="grid gap-8 border-t border-ink pt-10 md:grid-cols-12 md:pt-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-3xl leading-tight tracking-[-0.01em] md:text-4xl">The Neighbourhood Letter</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              New guides, people and places from African cities, every other Sunday.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end">
            <NewsletterForm source="footer" />
          </div>
        </div>
      </Container>
    </section>
  );
}
