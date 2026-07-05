import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAllPosts } from "@/lib/blog";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { resourceEntries, type ResourceEntry } from "./_data/resources";
import { ResourceCategoryRow } from "./_components/ResourceCategoryRow";

const NavigationDock = dynamic(() =>
  import("@/components/NavDoc").then((mod) => ({
    default: mod.NavigationDock,
  }))
);

const Footer = dynamic(() => import("@/components/Footer"));

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Toolkits, playbooks, and guides from ROV Studios: the tools, process, and thinking behind the brands and websites we ship.",
  alternates: { canonical: "https://www.rovstudios.com/resources" },
  openGraph: {
    title: "Resources | Range Of View Studios",
    description:
      "Toolkits, playbooks, and guides from ROV Studios: the tools, process, and thinking behind the brands and websites we ship.",
    url: "https://www.rovstudios.com/resources",
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: "ROV Studios Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | Range Of View Studios",
    description:
      "Toolkits, playbooks, and guides from ROV Studios: the tools, process, and thinking behind the brands and websites we ship.",
    images: ["/og/og-default.webp"],
  },
};

const BLOG_FEATURE_LIMIT = 4;

function getFeaturedBlogEntries(): ResourceEntry[] {
  const posts = getAllPosts().filter((post) => !post.externalUrl);

  return posts.slice(0, BLOG_FEATURE_LIMIT).map((post) => ({
    id: `blog-${post.slug}`,
    category: "Blog" as const,
    title: post.title,
    excerpt: post.description,
    href: `/blog/${post.slug}`,
    date: post.date,
    readingTime: post.readingTime || undefined,
    featured: post.featured,
  }));
}

export default function ResourcesPage() {
  const toolkits = resourceEntries.filter((entry) => entry.category === "Toolkit");
  const playbooks = resourceEntries.filter((entry) => entry.category === "Playbook");
  const guides = resourceEntries.filter((entry) => entry.category === "Guide");
  // Manual "Blog" entries in resources.ts (e.g. GEO /web pages we treat as blogs)
  // render in the same row as the real blog posts from getAllPosts().
  const manualBlogEntries = resourceEntries.filter((entry) => entry.category === "Blog");
  const blogEntries = [...manualBlogEntries, ...getFeaturedBlogEntries()];

  const hasAnyContent =
    toolkits.length > 0 || playbooks.length > 0 || guides.length > 0 || blogEntries.length > 0;

  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Resources", url: "/resources" },
        ]}
      />

      <section className="bg-black px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-4 text-[11px] font-bold uppercase text-[#EA9A61]"
            style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.22em" }}
          >
            Range Of View Studios
          </p>
          <h1
            className="text-white"
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.1,
            }}
          >
            The Resource Hub
          </h1>
          <p className="mt-4 max-w-lg text-base text-gray-400 sm:text-lg" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Toolkits, playbooks, and guides pulled from how we actually work. No gated
            downloads, no fluff, just what we use and why.
          </p>
        </div>
      </section>

      <section className="bg-black px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {hasAnyContent ? (
            <>
              <ResourceCategoryRow title="Toolkits" entries={toolkits} />
              <ResourceCategoryRow title="Playbooks" entries={playbooks} />
              <ResourceCategoryRow title="Guides" entries={guides} />
              <ResourceCategoryRow title="From the Blog" entries={blogEntries} />
            </>
          ) : (
            <p className="py-20 text-center text-gray-500">Nothing published here yet. Check back soon.</p>
          )}
        </div>
      </section>

      <NavigationDock />
      <Footer />
    </>
  );
}
