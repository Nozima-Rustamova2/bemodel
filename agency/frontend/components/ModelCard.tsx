"use client";

import Image from "next/image";
import Link from "next/link";
import { ModelListItem, assetUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function ModelCard({ model }: { model: ModelListItem }) {
  const { t } = useLanguage();
  const statKeys: (keyof typeof t.stats)[] = ["height", "bust", "waist", "hips", "shoes", "hair", "eyes"];
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
    .filter((s): s is { key: keyof typeof t.stats; value: string } => !!s.value);

  return (
    <div className="flex flex-col gap-3">
      <Link href={`/models/${model.slug}`} className="flip-card block relative aspect-[3/4]">
        <div className="flip-inner absolute inset-0 w-full h-full">
          <div className="flip-front absolute inset-0 overflow-hidden bg-placeholder">
            {model.cover_photo_url ? (
              <Image
                src={assetUrl(model.cover_photo_url)}
                alt={model.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-taupe text-sm">{t.modelCard.noPhoto}</div>
            )}
          </div>
          <div className="flip-back absolute inset-0 bg-ink text-mutedLight flex flex-col justify-center px-6 py-6">
            <div className="font-display text-2xl text-paperText leading-none mb-4">{model.name}</div>
            {stats.map(({ key, value }) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-paperText/[0.14] text-xs">
                <span className="text-[10px] tracking-[0.12em] uppercase text-taupe">{t.stats[key]}</span>
                <span className="text-paperText">{value}</span>
              </div>
            ))}
            <div className="mt-5 text-[10px] tracking-[0.2em] uppercase text-accentDeep">{t.modelCard.viewPortfolio}</div>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl leading-[1.1]">{model.name}</p>
          {model.city && <p className="mono-caption mt-0.5">{model.city}</p>}
        </div>
        <span className="text-[10px] eyebrow border-b border-ink pb-0.5 whitespace-nowrap">{t.modelCard.view}</span>
      </div>
    </div>
  );
}
