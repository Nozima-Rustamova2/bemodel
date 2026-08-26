import Link from "next/link";
import { notFound } from "next/navigation";
import { getModelBySlug } from "@/lib/api";
import Localized from "@/components/Localized";
import ModelPortfolio from "@/components/ModelPortfolio";
import { dict } from "@/lib/i18n";

const PORTFOLIO_SLOTS = 8;
const POLAROID_SLOTS = 4;

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

  const cover = model.photos.find((p) => p.is_cover) || model.photos[0];
  const rest = model.photos.filter((p) => p.id !== cover?.id);
  const gallery = rest.slice(0, PORTFOLIO_SLOTS);
  const polaroids = rest.slice(PORTFOLIO_SLOTS, PORTFOLIO_SLOTS + POLAROID_SLOTS);

  return (
    <div className="px-6 md:px-24 py-[clamp(36px,4vw,60px)]">
      <Link href="/models" className="text-[11px] tracking-[0.18em] uppercase text-inkSoft mb-10 inline-block">
        <Localized en={dict.en.modelDetail.backToRoster} ru={dict.ru.modelDetail.backToRoster} />
      </Link>

      <div className="grid md:grid-cols-[340px_1fr] gap-[clamp(40px,5vw,80px)] items-start">
        {/* Left: sticky measurements */}
        <div className="md:sticky md:top-[110px]">
          {model.city && <p className="eyebrow text-accent mb-4">{model.city}</p>}
          <h1 className="font-display font-medium text-[clamp(48px,5vw,74px)] leading-[0.98] mb-8">{model.name}</h1>

          {stats.length > 0 && (
            <div className="border-t border-hairline">
              {stats.map(({ key, value }) => (
                <div key={key} className="flex justify-between py-3.5 border-b border-hairline text-[13px]">
                  <span className="text-[11px] tracking-[0.14em] uppercase text-taupe">
                    <Localized en={dict.en.stats[key]} ru={dict.ru.stats[key]} />
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          {model.bio && <p className="text-sm leading-relaxed text-inkSoft mt-8 whitespace-pre-line">{model.bio}</p>}
        </div>

        {/* Right: portfolio + polaroids */}
        <div>
          <p className="eyebrow text-accent mb-5">
            <Localized en={dict.en.modelDetail.portfolio} ru={dict.ru.modelDetail.portfolio} />
          </p>
          <ModelPortfolio
            gallery={gallery.map((p) => ({ id: p.id, url: p.url }))}
            polaroids={polaroids.map((p) => ({ id: p.id, url: p.url }))}
            modelName={model.name}
          />
        </div>
      </div>
    </div>
  );
}
