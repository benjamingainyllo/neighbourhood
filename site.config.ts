/**
 * SITE SETTINGS
 * This is the one file you edit to change site-wide settings.
 * You don't need to touch any other code to change these.
 */

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Neighbourhood",
  tagline: "City guides, travel, people and photography from African cities",
  description:
    "Neighbourhood is an independent magazine for creative travellers in African cities: city guides, people, photography, essays by locals and places to stay in Lagos, Nairobi, Kigali and beyond.",
  url: resolveSiteUrl().replace(/\/$/, ""),
  locale: "en_GB",

  // Where people can reach you. Shown on Contact and Partner With Us pages and in the footer.
  email: {
    general: "hello@neighbourhood.example",
    partnerships: "partners@neighbourhood.example",
  },

  // Leave a value empty ("") to hide that link.
  social: {
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    linkedin: "",
  },

  /**
   * ADVERTISING (Google AdSense)
   * enabled: true  -> ad slots appear on article pages (never on the homepage)
   * enabled: false -> all ad slots disappear everywhere
   *
   * While `client` still contains "XXXX", the site shows grey "Advertisement"
   * boxes so you can see where ads will go. Paste your real AdSense publisher
   * ID and slot IDs once AdSense approves your site.
   */
  ads: {
    enabled: true,
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    slots: {
      inArticle: "0000000000", // after the 3rd paragraph
      endOfArticle: "0000000000", // after the article body
      sidebar: "0000000000", // right-hand column on desktop
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
