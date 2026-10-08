import { StaticPage } from "@/components/StaticPage";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// The words on this page live in content/pages/partner-with-us.mdx
const page = getPage("partner-with-us");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/partner-with-us" });

export default function Page() {
  return <StaticPage slug="partner-with-us" />;
}
