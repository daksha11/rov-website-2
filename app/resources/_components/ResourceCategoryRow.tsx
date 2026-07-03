import type { ResourceEntry } from "../_data/resources";
import { ResourceCard } from "./ResourceCard";

interface ResourceCategoryRowProps {
  title: string;
  entries: ResourceEntry[];
}

export function ResourceCategoryRow({ title, entries }: ResourceCategoryRowProps) {
  if (entries.length === 0) return null;

  return (
    <section className="mb-16">
      <h2
        className="mb-6 text-2xl text-white sm:text-3xl"
        style={{ fontFamily: "Norwige, sans-serif", fontWeight: 400 }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <ResourceCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
