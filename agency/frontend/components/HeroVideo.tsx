import { assetUrl } from "@/lib/api";

export default function HeroVideo({
  videoUrl,
  posterUrl,
  eyebrow,
  headline,
  body,
  minHeightClass = "min-h-[calc(100vh-81px)]",
  overlay = "bg-[linear-gradient(to_top,rgba(24,20,16,0.72),rgba(24,20,16,0.22)_45%,rgba(24,20,16,0.30))]",
  children,
}: {
  videoUrl: string | null;
  posterUrl?: string | null;
  eyebrow: React.ReactNode;
  headline: React.ReactNode;
  body?: React.ReactNode;
  minHeightClass?: string;
  overlay?: string;
  children?: React.ReactNode;
}) {
  if (!videoUrl) {
    return (
      <section className="px-6 md:px-24 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-hairline">
        <p className="eyebrow text-accentDeep mb-6">{eyebrow}</p>
        <h1 className="font-display font-medium text-[clamp(40px,7vw,100px)] leading-[0.97] max-w-4xl">
          {headline}
        </h1>
        {body && <p className="font-light text-base leading-[1.75] text-inkSoft max-w-md mt-8">{body}</p>}
        {children && <div className="mt-10 flex gap-4 flex-wrap">{children}</div>}
      </section>
    );
  }

  return (
    <section className={`relative ${minHeightClass} overflow-hidden flex items-end border-b border-hairline`}>
      <video
        src={assetUrl(videoUrl)}
        poster={posterUrl ? assetUrl(posterUrl) : undefined}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={`absolute inset-0 z-[1] ${overlay}`} />
      <div className="relative z-[2] w-full flex flex-col justify-end p-[clamp(40px,6vw,96px)] animate-fade-up">
        <p className="text-[11px] tracking-[0.28em] uppercase text-accentDeep mb-6">{eyebrow}</p>
        <h1
          className="font-display font-medium text-[clamp(52px,8vw,120px)] leading-[0.94] tracking-[-0.015em] text-paperText max-w-3xl"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.25)" }}
        >
          {headline}
        </h1>
        {body && (
          <p className="font-light text-base leading-[1.75] text-paperText/[0.86] max-w-md mt-8">{body}</p>
        )}
        {children && <div className="mt-10 flex gap-4 flex-wrap">{children}</div>}
      </div>
    </section>
  );
}
