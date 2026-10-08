import { ArticleCard } from "@/components/ArticleCard";
import { CityCard } from "@/components/CityCard";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticlesByCity, getArticlesBySection, getCities } from "@/lib/content";
import { getSection } from "@/lib/sections";
import { pageMetadata } from "@/lib/seo";

const section = getSection("city-guides")!;

export const metadata = pageMetadata({
  title: "City Guides",
  description: "Neighbourhood city guides to Lagos, Nairobi, Kigali and more: where to eat, drink, stay and explore, written by locals.",
  path: "/city-guides",
});

export default function CityGuidesPage() {
  const cities = getCities();
  const guides = getArticlesBySection("city-guides");

  return (
    <>
      <PageHeader eyebrow="Neighbourhood" title="City Guides" intro={section.description} />

      <Container as="section">
        <SectionHeading title="Choose a city" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-8">
          {cities.map((city) => (
            <CityCard
              key={city.slug}
              city={city}
              count={getArticlesByCity(city.slug).length}
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          ))}
        </div>
      </Container>

      {guides.length > 0 && (
        <Container as="section" className="mt-24 md:mt-32">
          <SectionHeading title="Latest guides" />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((a) => (
              <ArticleCard key={a.href} article={a} showExcerpt />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
