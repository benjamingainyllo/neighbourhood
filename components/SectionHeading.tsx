import Link from "next/link";

/** Heading for a block of stories, with an optional "View all" link. */
export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "View all",
  as: Tag = "h2",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 border-t border-ink pt-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
      <div>
        <Tag className="font-serif text-3xl leading-tight tracking-[-0.01em] md:text-4xl">
          {href ? (
            <Link href={href} className="hover:text-accent">
              {title}
            </Link>
          ) : (
            title
          )}
        </Tag>
        {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="label shrink-0 text-ink hover:text-accent">
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
