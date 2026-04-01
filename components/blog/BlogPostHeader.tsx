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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogPostHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mx-auto max-w-[720px] px-5 pb-10 pt-24 sm:pt-32">
      <span
        className={`inline-block text-[0.6875rem] font-semibold uppercase tracking-wider ${getCategoryStyle(post.category).split(' ').filter(c => c.startsWith('text-')).join(' ')}`}
      >
        {post.category}
      </span>

      <h1
        className="mt-6 text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        {post.title}
      </h1>

      {post.description && (
        <p className="mt-4 text-lg leading-relaxed text-gray-400 sm:text-xl">
          {post.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="text-gray-300">{post.author}</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>
    </header>
  );
}
