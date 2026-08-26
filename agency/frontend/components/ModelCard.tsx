"use client";

import Image from "next/image";
import Link from "next/link";
import { ModelListItem, assetUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function ModelCard({ model }: { model: ModelListItem }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3">
      <Link href={`/models/${model.slug}`} className="group block relative aspect-[3/4] overflow-hidden bg-placeholder">
        {model.cover_photo_url ? (
          <Image
            src={assetUrl(model.cover_photo_url)}
            alt={model.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            quality={90}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-sm">
            {t.modelCard.noPhoto}
          </div>
        )}

        {/* Dim on hover. Sits above the photo but below the name so the name
            stays at full strength rather than dimming with the image. */}
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />

        {model.cover_photo_url && (
          <>
            {/* A gradient only along the bottom edge: enough to hold the name
                against a light photo without greying out the whole frame. */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(20,16,26,0.55),transparent)]" />
            {/* Inset rule, as in the reference, rather than a full box border. */}
            <div className="absolute inset-x-[7%] bottom-[13%] border-b border-paperText/45" />
            <p
              className="absolute inset-x-[7%] bottom-[16%] text-center uppercase text-paperText tracking-[0.16em] text-[clamp(13px,1.15vw,17px)] leading-none"
              style={{ textShadow: "0 1px 16px rgba(0,0,0,0.55)" }}
            >
              {model.name}
            </p>
          </>
        )}
      </Link>

      {model.city && <p className="mono-caption">{model.city}</p>}
    </div>
  );
}
