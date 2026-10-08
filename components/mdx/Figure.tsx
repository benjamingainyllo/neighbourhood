import Image from "next/image";
import { imageSrc } from "@/lib/utils";

const ratios = {
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
} as const;

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  /** "3/2" (default), "4/3", "16/9", "4/5" (portrait) or "1/1" */
  ratio?: keyof typeof ratios;
  /** "full" (default) spans the whole article column; "text" matches the text width */
  size?: "full" | "text";
};

/**
 * A photo with caption, for use inside articles:
 * <Figure src="https://..." alt="..." caption="..." credit="Photo: Jane Doe" />
 */
export function Figure({ src, alt = "", caption, credit, ratio = "3/2", size = "full" }: Props) {
  const r = ratios[ratio] ?? ratios["3/2"];
  const full = size === "full";
  return (
    <figure className={full ? "-mx-4 sm:-mx-6 md:mx-0 xl:-mx-16" : ""}>
      <div className={`relative overflow-hidden bg-paper-deep ${r} ${ratio === "4/5" && full ? "md:mx-auto md:max-w-[70%]" : ""}`}>
        <Image
          src={imageSrc(src, 2000)}
          alt={alt}
          fill
          sizes={full ? "(min-width: 1280px) 810px, (min-width: 768px) 680px, 100vw" : "(min-width: 768px) 680px, 100vw"}
          className="object-cover"
        />
      </div>
      {(caption || credit) && (
        <figcaption className={`mt-3 text-[0.8125rem] leading-snug text-muted ${full ? "px-4 sm:px-6 md:px-0 xl:px-16" : ""}`}>
          {caption}
          {caption && credit && " "}
          {credit && <span className="text-muted/80 italic">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
