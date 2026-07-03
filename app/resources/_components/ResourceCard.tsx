import Link from "next/link";
import type { ResourceEntry } from "../_data/resources";

const categoryColors: Record<string, string> = {
  Toolkit: "text-emerald-400",
  Playbook: "text-amber-400",
  Guide: "text-[#EA9A61]",
  Signals: "text-purple-400",
  Blog: "text-blue-400",
};

function getCategoryStyle(category: string): string {
  return categoryColors[category] ?? "text-gray-300";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ResourceCard({ entry }: { entry: ResourceEntry }) {
  const linkProps = entry.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={entry.href}
      {...linkProps}
      className="group block rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.04]"
    >
      <span
        className={`inline-block text-[0.6875rem] font-semibold uppercase tracking-wider ${getCategoryStyle(entry.category)}`}
      >
        {entry.category}
      </span>

      <h3
        className="mt-4 text-xl leading-snug text-white line-clamp-2 sm:text-2xl"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        {entry.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-3">
        {entry.excerpt}
      </p>

      <div className="mt-5 flex items-center gap-3 text-xs text-gray-500">
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        {typeof entry.readingTime === "number" && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{entry.readingTime} min read</span>
          </>
        )}
      </div>
    </Link>
  );
}
