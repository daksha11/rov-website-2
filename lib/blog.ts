import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogSite } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function parseFaqs(markdown: string): { question: string; answer: string }[] {
  const faqSection = markdown.split(/^## Frequently Asked Questions/m)[1];
  if (!faqSection) return [];

  const faqs: { question: string; answer: string }[] = [];
  const blocks = faqSection.split(/^### /m).filter((b) => b.trim());

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const question = lines[0].trim();
    const answer = lines
      .slice(1)
      .join("\n")
      .trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

function ensureBlogDir(): boolean {
  return fs.existsSync(BLOG_DIR);
}

function parseFrontmatter(slug: string, fileContent: string): BlogPost {
  const { data, content } = matter(fileContent);

  return {
    slug,
    // Anything that is not explicitly "music" belongs to studios. Defaulting the
    // other way would publish a forgotten frontmatter field to the wrong domain.
    site: data.site === "music" ? "music" : "studios",
    title: data.title ?? "",
    seoTitle: data.seoTitle ?? undefined,
    description: data.description ?? "",
    author: data.author ?? "",
    authorRole: data.authorRole ?? undefined,
    authorUrl: data.authorUrl ?? undefined,
    date: data.date ?? "",
    dateModified: data.dateModified ?? data.date ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    readingTime: data.readingTime ?? 0,
    atlantaAngle: data.atlantaAngle ?? "",
    published: data.published ?? true,
    externalUrl: data.externalUrl ?? undefined,
    coverImage: data.coverImage ?? undefined,
    content,
  };
}

/** Both blogs author into the same content/blog directory and are separated by
 *  the `site` frontmatter field, so every read path has to filter by host. */
function getPostsForSite(site: BlogSite): BlogPost[] {
  if (!ensureBlogDir()) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      return parseFrontmatter(slug, raw);
    })
    .filter((post) => post.published && post.site === site);

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/** rovstudios.com posts. Every existing caller (the studios blog, /resources,
 *  app/sitemap.ts) keeps its current behaviour because "studios" is the default. */
export function getAllPosts(): BlogPost[] {
  return getPostsForSite("studios");
}

/** rovmusic.com posts. Feeds app/sound/blog and app/music-sitemap.xml. */
export function getMusicPosts(): BlogPost[] {
  return getPostsForSite("music");
}

export async function getPostBySlug(
  slug: string,
  site: BlogSite = "studios"
): Promise<BlogPost | null> {
  if (!ensureBlogDir()) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const post = parseFrontmatter(slug, raw);

  // A slug is only reachable from its own host. Without this, a music post would
  // still render at rovstudios.com/blog/<slug> on a direct hit, duplicating the
  // page across both domains under two different canonicals.
  if (post.site !== site) return null;

  // Extract FAQs from markdown before rendering
  post.faqs = parseFaqs(post.content);

  // Split content: everything before "## Frequently Asked Questions" becomes the body
  const faqSplit = post.content.split(/^## Frequently Asked Questions/m);
  const bodyMarkdown = faqSplit[0].trim();

  const { remark } = await import("remark");
  const remarkHtml = (await import("remark-html")).default;
  const rehypeSanitize = (await import("rehype-sanitize")).default;
  const { unified } = await import("unified");
  const remarkParse = (await import("remark-parse")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(bodyMarkdown);
  post.htmlContent = result.toString();

  return post;
}

export function getPostSlugs(site: BlogSite = "studios"): string[] {
  return getPostsForSite(site).map((post) => post.slug);
}

export function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit: number = 3,
  site: BlogSite = "studios"
): BlogPost[] {
  return getPostsForSite(site)
    .filter((post) => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
}
