import Image from "next/image";
import { assetUrl, AcademyBrand } from "@/lib/api";

/**
 * Continuously scrolling strip of brand logos.
 *
 * The track holds two identical copies of the list and slides left by exactly
 * half its width, so the moment the first copy leaves the frame the second is
 * sitting in the same place — the loop has no visible seam. Duration scales with
 * the number of logos to keep a constant speed rather than a constant lap time.
 *
 * Every logo is drawn at a common height and keeps its own width, so a square
 * badge and a wide wordmark both read at their natural proportions.
 */
const LOGO_HEIGHT = 58;

export default function BrandMarquee({ brands }: { brands: AcademyBrand[] }) {
  if (brands.length === 0) return null;

  const loop = [...brands, ...brands];
  const seconds = Math.max(18, brands.length * 4.5);

  return (
    <div
      className="marquee-mask relative overflow-hidden"
      style={{ ["--marquee-duration" as string]: `${seconds}s` }}
    >
      <div className="marquee-track flex w-max items-center gap-[clamp(38px,5vw,76px)]">
        {loop.map((brand, i) => {
          // Older rows predate the stored dimensions; fall back to a square so
          // the layout still reserves a sane amount of space.
          const w = brand.width ?? 1;
          const h = brand.height ?? 1;
          return (
            <Image
              key={`${brand.id}-${i}`}
              src={assetUrl(brand.image_url)}
              alt={brand.name || ""}
              width={w}
              height={h}
              quality={95}
              aria-hidden={i >= brands.length}
              className="w-auto shrink-0 object-contain opacity-80"
              style={{ height: LOGO_HEIGHT }}
            />
          );
        })}
      </div>
    </div>
  );
}
