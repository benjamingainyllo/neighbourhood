/** Turn any text into a URL-friendly slug: "Street Food" -> "street-food" */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "2026-09-12" -> "12 September 2026" */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Unsplash URLs are requested at a sensible size so pages stay fast.
 * Local images (e.g. "/images/my-photo.jpg") are returned unchanged.
 */
export function imageSrc(src: string, width = 2400): string {
  if (!/^https:\/\/(images|plus)\.unsplash\.com\//.test(src)) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");
  return url.toString();
}

/** A 1200x630 version of an image for social sharing previews. */
export function ogImageSrc(src: string): string {
  if (!/^https:\/\/(images|plus)\.unsplash\.com\//.test(src)) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("q", "80");
  return url.toString();
}

export function absoluteUrl(path: string, base: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
