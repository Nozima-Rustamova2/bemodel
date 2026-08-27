import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getModelBySlug, assetUrl } from "@/lib/api";
import Localized from "@/components/Localized";
import ModelPortfolioStrip from "@/components/ModelPortfolioStrip";
import { dict } from "@/lib/i18n";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let model;
  try {
    model = await getModelBySlug(slug);
  } catch {
    notFound();
  }
  if (!model) notFound();

  const statKeys: (keyof typeof dict.en.stats)[] = ["height", "bust", "waist", "hips", "shoes", "hair", "eyes"];
  const statValues: (string | null)[] = [
    model.height && `${model.height} cm`,
    model.bust && `${model.bust} cm`,
    model.waist && `${model.waist} cm`,
    model.hips && `${model.hips} cm`,
    model.shoes && `${model.shoes} EU`,
    model.hair,
    model.eyes,
  ];
  const stats = statKeys
    .map((key, i) => ({ key, value: statValues[i] }))
    .filter((s): s is { key: keyof typeof dict.en.stats; value: string } => !!s.value);

  // The cover is this page's main photo and nothing else — the roster card and
  // the strip below both run off the portfolio.
  const cover = model.photos.find((p) => p.is_cover) || model.photos[0];
  const portfolio = model.photos.filter((p) => p.id !== cover?.id);

  return (
    <div className="pt-[clamp(24px,3vw,40px)]">
      <div className="px-6 md:px-24 mb-[clamp(16px,2vw,28px)]">
        <Link href="/models" className="text-[11px] tracking-[0.18em] uppercase text-inkSoft">
          <Localized en={dict.en.modelDetail.backToRoster} ru={dict.ru.modelDetail.backToRoster} />
        </Link>
      </div>

      {/* Half the viewport each. The photo is square, so from md up the whole
          block stands exactly 50vw tall and the photo runs flush to the right
          edge — this one block carries no page gutter. On mobile the halves
          stack and the photo leads. */}
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-square bg-placeholder overflow-hidden md:order-2">
          {cover ? (
            <Image
              src={assetUrl(cover.url)}
              alt={model.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-inkSoft text-sm">
              <Localized en={dict.en.modelDetail.noPhotosYet} ru={dict.ru.modelDetail.noPhotosYet} />
            </div>
          )}
        </div>

        <div className="md:order-1 flex flex-col items-center justify-center text-center px-6 py-[clamp(40px,5vw,72px)]">
          <h1 className="font-display font-medium text-[clamp(46px,4.6vw,72px)] leading-[0.98] mb-7">
            {model.name}
          </h1>

          {/* Label light, value bold, pairs running inline and wrapping — the
              measurements read as one block rather than a ruled table. */}
          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[clamp(15px,1.45vw,19px)] uppercase tracking-[0.1em] leading-none max-w-xl">
              {stats.map(({ key, value }) => (
                <span key={key} className="whitespace-nowrap">
                  <span className="font-light text-taupe">
                    <Localized en={dict.en.stats[key]} ru={dict.ru.stats[key]} />
                  </span>{" "}
                  <span className="font-medium text-ink">{value}</span>
                </span>
              ))}
            </div>
          )}

          {model.bio && (
            <p className="text-sm leading-relaxed text-inkSoft mt-8 whitespace-pre-line max-w-md">{model.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-[clamp(56px,7vw,110px)]">
        <ModelPortfolioStrip photos={portfolio} modelName={model.name} />
      </div>
    </div>
  );
}
