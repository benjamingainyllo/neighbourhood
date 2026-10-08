import { StaticPage } from "@/components/StaticPage";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// The words on this page live in content/pages/about.mdx
const page = getPage("about");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/about" });

export default function Page() {
  return <StaticPage slug="about" />;
}
