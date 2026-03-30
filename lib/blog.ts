import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@/lib/types";

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
    title: data.title ?? "",
    description: data.description ?? "",
    author: data.author ?? "",
    date: data.date ?? "",
    dateModified: data.dateModified ?? data.date ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    readingTime: data.readingTime ?? 0,
    atlantaAngle: data.atlantaAngle ?? "",
    published: data.published ?? true,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!ensureBlogDir()) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      return parseFrontmatter(slug, raw);
    })
    .filter((post) => post.published);

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!ensureBlogDir()) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const post = parseFrontmatter(slug, raw);

  // Extract FAQs from markdown before rendering
  post.faqs = parseFaqs(post.content);

  // Split content: everything before "## Frequently Asked Questions" becomes the body
  const faqSplit = post.content.split(/^## Frequently Asked Questions/m);
  const bodyMarkdown = faqSplit[0].trim();

  const { remark } = await import("remark");
  const remarkHtml = (await import("remark-html")).default;

  const result = await remark().use(remarkHtml).process(bodyMarkdown);
  post.htmlContent = result.toString();

  return post;
}

export function getPostSlugs(): string[] {
  if (!ensureBlogDir()) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
}
