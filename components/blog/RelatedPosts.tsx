import { BlogPost } from "@/lib/types";
import { BlogCard } from "./BlogCard";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  const displayed = posts.slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl border-t border-white/10 px-5 py-16">
      <h2
        className="mb-10 text-2xl text-white sm:text-3xl"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        More from the blog
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
