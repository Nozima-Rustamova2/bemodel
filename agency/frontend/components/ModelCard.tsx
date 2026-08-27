"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModelListItem, assetUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function ModelCard({ model }: { model: ModelListItem }) {
  const { t } = useLanguage();

  // Fall back to the cover alone for anything the API returned without a
  // preview list, so a card always has at least one frame to draw.
  const photos =
    model.preview_photo_urls?.length > 0
      ? model.preview_photo_urls
      : model.cover_photo_url
        ? [model.cover_photo_url]
        : [];

  const [first, second] = photos;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={`/models/${model.slug}`}
        className="group block relative aspect-[3/4] overflow-hidden bg-placeholder"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {first ? (
          <>
            <Image
              src={assetUrl(first)}
              alt={model.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={90}
              priority
              className="object-cover"
            />
            {/* The second photo sits on top and fades in on hover. Both are in
                the DOM from the start so the swap has nothing to wait for. */}
            {second && (
              <Image
                src={assetUrl(second)}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
                className="object-cover transition-opacity duration-500"
                style={{ opacity: hovered ? 1 : 0 }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-sm">
            {t.modelCard.noPhoto}
          </div>
        )}

        {first && (
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
    </div>
  );
}
