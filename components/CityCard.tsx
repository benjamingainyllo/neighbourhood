import Image from "next/image";
import Link from "next/link";
import type { City } from "@/lib/content";
import { imageSrc } from "@/lib/utils";

/** City tile for the city directory. */
export function CityCard({ city, count, sizes }: { city: City; count: number; sizes?: string }) {
  return (
    <Link href={`/${city.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep">
        <Image
          src={imageSrc(city.heroImage, 1400)}
          alt={city.heroAlt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-paper md:p-5">
          <p className="label opacity-80">{city.country}</p>
          <p className="mt-1 font-serif text-3xl leading-none md:text-4xl">{city.name}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        {count} {count === 1 ? "story" : "stories"} <span aria-hidden>→</span>
      </p>
    </Link>
  );
}
