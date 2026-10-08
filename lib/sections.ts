/**
 * The magazine's sections. The `slug` is what you write in an article's
 * `section:` field. Order here = order in the navigation and on the homepage.
 */
export const sections = [
  {
    slug: "city-guides",
    name: "City Guides",
    description: "Where to eat, drink, shop and wander, chosen by people who live there.",
  },
  {
    slug: "travel",
    name: "Travel",
    description: "Journeys, long weekends and slow itineraries across the continent.",
  },
  {
    slug: "people",
    name: "People",
    description: "Conversations with the artists, designers, chefs and founders shaping their cities.",
  },
  {
    slug: "photography",
    name: "Photography",
    description: "Photo essays and portfolios from behind the lens.",
  },
  {
    slug: "my-city",
    name: "My City",
    description: "Personal essays by locals on the places they call home.",
  },
  {
    slug: "stays",
    name: "Stays",
    description: "Hotels, guesthouses and apartments worth building a trip around.",
  },
] as const;

export type Section = (typeof sections)[number];
export type SectionSlug = Section["slug"];

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}
