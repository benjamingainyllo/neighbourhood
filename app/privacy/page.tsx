import { StaticPage } from "@/components/StaticPage";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// The words on this page live in content/pages/privacy.mdx
const page = getPage("privacy");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/privacy" });

export default function Page() {
  return <StaticPage slug="privacy" />;
}
