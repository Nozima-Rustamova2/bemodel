import Image from "next/image";
import { assetUrl, AcademyBrand } from "@/lib/api";

/**
 * Continuously scrolling strip of brand logos.
 *
 * The track holds two identical runs of the list and slides left by exactly
 * half its width, so the moment the first run leaves the frame the second is
 * sitting in the same place — the loop has no visible seam.
 *
 * That only works while a single run is wider than the screen. With two or
 * three logos it isn't, and the strip slides itself empty. So each run repeats
 * the list until it clears MIN_RUN_WIDTH, using the stored dimensions to work
 * out how wide the logos actually are rather than guessing.
 *
 * Every logo is drawn at a common height and keeps its own width, so a square
 * badge and a wide wordmark both read at their natural proportions.
 */
const LOGO_HEIGHT = 58;
// The narrowest the gap between logos ever gets, from the clamp below. Using the
// minimum keeps the width estimate conservative: real gaps are wider, so a run
// that clears the target here clears it on screen too.
const MIN_GAP = 38;
// Comfortably past a 1920px viewport, so one run always spans the widest screen.
const MIN_RUN_WIDTH = 2400;

export default function BrandMarquee({ brands }: { brands: AcademyBrand[] }) {
  if (brands.length === 0) return null;

  const runWidth = brands.reduce((total, brand) => {
    // Older rows predate the stored dimensions; treat those as square.
    const ratio = brand.width && brand.height ? brand.width / brand.height : 1;
    return total + LOGO_HEIGHT * ratio + MIN_GAP;
  }, 0);

  const repeats = Math.max(1, Math.ceil(MIN_RUN_WIDTH / runWidth));
  const run = Array.from({ length: repeats }, () => brands).flat();
  const loop = [...run, ...run];
  // Duration tracks the real number of logos so the speed stays constant
  // whether the agency has three partners or thirty.
  const seconds = Math.max(18, run.length * 4.5);

  return (
    <div
      className="marquee-mask relative overflow-hidden"
      style={{ ["--marquee-duration" as string]: `${seconds}s` }}
    >
      <div className="marquee-track flex w-max items-center gap-[clamp(38px,5vw,76px)]">
        {loop.map((brand, i) => {
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
              // Only the first pass through the real list is content; the rest
              // exists to fill the loop and should not be read out.
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
