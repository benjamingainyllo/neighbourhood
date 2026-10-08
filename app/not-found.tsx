import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center md:py-36">
      <p className="label text-accent">404</p>
      <h1 className="mt-4 font-serif text-5xl tracking-[-0.02em] md:text-7xl">Wrong turn.</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">
        We couldn&rsquo;t find that page. It may have moved, or the address might be mistyped.
      </p>
      <div className="mt-8 flex justify-center gap-6">
        <Link href="/" className="label link-underline">
          Go to the homepage
        </Link>
        <Link href="/search" className="label link-underline">
          Search stories
        </Link>
      </div>
    </Container>
  );
}
