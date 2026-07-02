import Link from "next/link";
import { BlogPost } from "@/lib/types";

const categoryColors: Record<string, string> = {
  "Web Design": "bg-blue-500/15 text-blue-400",
  "Web Development": "bg-emerald-500/15 text-emerald-400",
  "AI Automation": "bg-amber-500/15 text-amber-400",
  "Sound Engineering": "bg-purple-500/15 text-purple-400",
  "Video Production": "bg-rose-500/15 text-rose-400",
  "Branding": "bg-cyan-500/15 text-cyan-400",
  "Branding & Web Design": "bg-[#EA9A61]/15 text-[#EA9A61]",
  "Marketing": "bg-orange-500/15 text-orange-400",
};

function getCategoryStyle(category: string): string {
  return categoryColors[category] ?? "bg-white/10 text-gray-300";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  const excerpt =
    post.description ||
    post.content.replace(/[#*_`>\[\]]/g, "").slice(0, 160).trim() + "...";

  return (
    <Link
      href={post.externalUrl ?? `/blog/${post.slug}`}
      className="group block rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.04]"
    >
      <span
        className={`inline-block text-[0.6875rem] font-semibold uppercase tracking-wider ${getCategoryStyle(post.category).split(' ').filter(c => c.startsWith('text-')).join(' ')}`}
      >
        {post.category}
      </span>

      <h3
        className="mt-4 text-xl leading-snug text-white line-clamp-2 sm:text-2xl"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        {post.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-3">
        {excerpt}
      </p>

      <div className="mt-5 flex items-center gap-3 text-xs text-gray-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>
    </Link>
  );
}
