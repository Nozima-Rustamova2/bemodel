import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModelBySlug, assetUrl } from "@/lib/api";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

const POLAROID_LABELS_EN = ["Front", "Profile", "Full length", "Smile"];
const POLAROID_LABELS_RU = [
  dict.ru.photoLabels.front,
  dict.ru.photoLabels.profile,
  dict.ru.photoLabels.fullLength,
  dict.ru.photoLabels.smile,
];

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

  const photos = model.photos;
  const gallery = photos.slice(0, 3);
  const polaroids = POLAROID_LABELS_EN.map((_, i) => photos[i % Math.max(photos.length, 1)] ?? null).map(
    (photo, i) => ({ photo, labelEn: POLAROID_LABELS_EN[i], labelRu: POLAROID_LABELS_RU[i] })
  );

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

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2.5 px-7 py-[15px] bg-ink text-paper text-[11px] eyebrow hover:bg-accent transition-colors"
          >
            <Localized en={dict.en.modelDetail.bookModel} ru={dict.ru.modelDetail.bookModel} />
          </Link>
        </div>

        {/* Right: portfolio + polaroids */}
        <div>
          <p className="eyebrow text-accent mb-5">
            <Localized en={dict.en.modelDetail.portfolio} ru={dict.ru.modelDetail.portfolio} />
          </p>
          {gallery.length === 0 ? (
            <p className="text-inkSoft text-sm">
              <Localized en={dict.en.modelDetail.noPhotosYet} ru={dict.ru.modelDetail.noPhotosYet} />
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {gallery.map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] bg-placeholder overflow-hidden">
                  <Image
                    src={assetUrl(photo.url)}
                    alt={model.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <>
              <p className="eyebrow text-accent mt-14 mb-2">
                <Localized en={dict.en.modelDetail.polaroidsDigitals} ru={dict.ru.modelDetail.polaroidsDigitals} />
              </p>
              <p className="text-[13px] font-light text-taupe mb-5">
                <Localized en={dict.en.modelDetail.polaroidNote} ru={dict.ru.modelDetail.polaroidNote} />
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {polaroids.map(({ photo, labelEn, labelRu }, i) =>
                  photo ? (
                    <div key={i} className="bg-polaroid p-[10px_10px_34px] shadow-[0_8px_22px_rgba(33,29,24,0.10)] border border-ink/[0.06]">
                      <div className="relative aspect-[3/4] bg-placeholder overflow-hidden">
                        <Image src={assetUrl(photo.url)} alt={labelEn} fill sizes="200px" className="object-cover" />
                      </div>
                      <p className="mono-caption text-center mt-3">
                        <Localized en={labelEn} ru={labelRu} />
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
