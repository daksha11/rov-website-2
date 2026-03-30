import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const NavigationDock = dynamic(
  () =>
    import("@/components/NavDoc").then((mod) => ({
      default: mod.NavigationDock,
    })),
  { ssr: false }
);

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Web design insights, case studies, and digital strategy from ROV Studios in Atlanta, Georgia.",
  alternates: { canonical: "https://rovstudios.com/blog" },
  openGraph: {
    title: "Blog | Range of View Studios",
    description:
      "Web design insights, case studies, and digital strategy from ROV Studios in Atlanta.",
    url: "https://rovstudios.com/blog",
    images: [
      {
        url: "/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ROV Studios Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Range of View Studios",
    description:
      "Web design insights, case studies, and digital strategy from ROV Studios in Atlanta.",
    images: ["/og/og-default.jpg"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Blog", url: "/blog" },
        ]}
      />

      <section className="bg-black px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-white"
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.1,
            }}
          >
            THE BLOG
          </h1>
          <p className="mt-4 max-w-lg text-base text-gray-400 sm:text-lg">
            Case studies, insights, and web design strategy from Atlanta.
          </p>
        </div>
      </section>

      <section className="bg-black px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-gray-500">No posts yet.</p>
          )}
        </div>
      </section>

      <NavigationDock />
      <Footer />
    </>
  );
}
