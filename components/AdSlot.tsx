import { siteConfig } from "@/site.config";
import { AdUnit } from "./AdUnit";

type Placement = keyof typeof siteConfig.ads.slots;

const minHeights: Record<Placement, string> = {
  inArticle: "min-h-[280px]",
  endOfArticle: "min-h-[280px]",
  sidebar: "min-h-[600px]",
};

/**
 * A reserved space for a Google AdSense ad.
 * Turn every ad on or off with `ads.enabled` in site.config.ts.
 */
export function AdSlot({ placement, className = "" }: { placement: Placement; className?: string }) {
  const { enabled, client, slots } = siteConfig.ads;
  if (!enabled) return null;

  const isPlaceholder = client.includes("XXXX");

  return (
    <aside aria-label="Advertisement" className={className}>
      <p className="label mb-2 text-center text-[0.625rem] text-muted">Advertisement</p>
      <div className={`flex items-center justify-center bg-paper-deep ${minHeights[placement]}`}>
        {isPlaceholder ? (
          <span className="text-xs text-muted">Ad space: {placement}</span>
        ) : (
          <AdUnit client={client} slot={slots[placement]} />
        )}
      </div>
    </aside>
  );
}
