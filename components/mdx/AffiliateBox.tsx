import Image from "next/image";
import { imageSrc } from "@/lib/utils";

const kinds = {
  hotel: "Where to stay",
  tour: "Book the experience",
  esim: "Stay connected",
} as const;

type Props = {
  /** "hotel", "tour" or "esim" */
  type?: keyof typeof kinds;
  title: string;
  description?: string;
  href: string;
  /** Button text, e.g. "Check availability" */
  cta?: string;
  /** Who you're booking with, e.g. "Booking.com" */
  partner?: string;
  /** Optional price line, e.g. "From £95 a night" */
  price?: string;
  image?: string;
  imageAlt?: string;
};

/**
 * Recommendation box with an affiliate link and a disclosure line.
 * <AffiliateBox type="hotel" title="..." description="..." href="https://..." partner="Booking.com" />
 */
export function AffiliateBox({
  type = "hotel",
  title,
  description,
  href,
  cta = "Check availability",
  partner,
  price,
  image,
  imageAlt = "",
}: Props) {
  const label = kinds[type] ?? kinds.hotel;
  return (
    <aside className="border border-ink bg-paper" aria-label={`${label}: ${title}`}>
      <div className={`grid ${image ? "sm:grid-cols-[180px_1fr]" : ""}`}>
        {image && (
          <div className="relative aspect-[16/9] bg-paper-deep sm:aspect-auto">
            <Image src={imageSrc(image, 800)} alt={imageAlt} fill sizes="(min-width: 640px) 180px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="p-5 md:p-6">
          <p className="label text-accent">{label}</p>
          <p className="mt-2 font-serif text-2xl leading-tight text-ink">{title}</p>
          {description && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{description}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={href}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="label inline-flex h-11 items-center bg-ink px-5 !text-paper !no-underline transition-colors hover:bg-accent"
            >
              {cta} <span aria-hidden className="ml-2">↗</span>
            </a>
            {(price || partner) && (
              <p className="text-sm text-muted">
                {price}
                {price && partner && " · "}
                {partner && <>via {partner}</>}
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="border-t border-line px-5 py-2.5 text-xs leading-snug text-muted md:px-6">
        We may earn a commission if you book through this link, at no extra cost to you. It never affects what we
        recommend.
      </p>
    </aside>
  );
}
