import Link from "next/link";
import { getCity } from "@/lib/content";
import { getSection } from "@/lib/sections";

/** The small label above a headline, e.g. "LAGOS · CITY GUIDES". */
export function Kicker({
  city,
  section,
  sponsored,
  linked = false,
  className = "",
}: {
  city: string;
  section: string;
  sponsored?: boolean;
  linked?: boolean;
  className?: string;
}) {
  const cityName = getCity(city)?.name ?? city;
  const sectionName = getSection(section)?.name ?? section;

  return (
    <p className={`label flex flex-wrap items-center gap-x-2 gap-y-1 text-muted ${className}`}>
      {sponsored && <PartnershipLabel />}
      {linked ? (
        <>
          <Link href={`/${city}`} className="text-accent hover:text-ink">
            {cityName}
          </Link>
          <span aria-hidden>·</span>
          <Link href={`/section/${section}`} className="hover:text-ink">
            {sectionName}
          </Link>
        </>
      ) : (
        <>
          <span className="text-accent">{cityName}</span>
          <span aria-hidden>·</span>
          <span>{sectionName}</span>
        </>
      )}
    </p>
  );
}

export function PartnershipLabel({ className = "" }: { className?: string }) {
  return (
    <span className={`label inline-block border border-ink px-1.5 py-0.5 leading-none text-ink ${className}`}>
      Partnership
    </span>
  );
}
