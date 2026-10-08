import { StaticPage } from "@/components/StaticPage";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// The words on this page live in content/pages/contact.mdx
const page = getPage("contact");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/contact" });

export default function Page() {
  return <StaticPage slug="contact" />;
}
