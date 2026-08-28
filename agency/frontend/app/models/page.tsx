import Link from "next/link";
import { getModels } from "@/lib/api";
import ModelCard from "@/components/ModelCard";
import Localized from "@/components/Localized";
import { dict } from "@/lib/i18n";

const TABS = [
  { value: "Model", labelEn: dict.en.nav.models, labelRu: dict.ru.nav.models },
  { value: "New Faces", labelEn: dict.en.nav.newFaces, labelRu: dict.ru.nav.newFaces },
];

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = TABS.some((t) => t.value === rawCategory) ? (rawCategory as string) : "Model";
  const activeTab = TABS.find((t) => t.value === activeCategory);

  const models = await getModels(activeCategory).catch(() => []);

  return (
    <div className="px-6 md:px-24 py-[clamp(48px,6vw,84px)]">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-11 border-b border-hairline pb-[30px]">
        <div>
          <h1 className="font-display font-light text-[clamp(46px,6vw,84px)] leading-none">
            <Localized en={activeTab?.labelEn ?? activeCategory} ru={activeTab?.labelRu ?? activeCategory} />
          </h1>
        </div>
        <div className="flex gap-7 text-xs tracking-[0.14em] uppercase">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/models?category=${encodeURIComponent(tab.value)}`}
              className={`pb-1.5 border-b-2 ${
                activeCategory === tab.value ? "border-ink text-ink" : "border-transparent text-mutedLight"
              }`}
            >
              <Localized en={tab.labelEn} ru={tab.labelRu} />
            </Link>
          ))}
        </div>
      </div>

      {models.length === 0 ? (
        <p className="text-inkSoft text-sm">
          <Localized en={dict.en.roster.noModelsInCategory} ru={dict.ru.roster.noModelsInCategory} />
        </p>
      ) : (
        <div className="grid gap-x-[26px] gap-y-[38px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </div>
  );
}
