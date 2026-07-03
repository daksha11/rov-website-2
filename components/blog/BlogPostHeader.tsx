import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types";

// Map known authors to their team avatar. Falls back to the ROV logo mark
// for "ROV Studios" or any author without a headshot on file.
const authorAvatars: Record<string, string> = {
  "Suchet Konda": "/teammembers/suchettm.webp",
  "Ayush Basu": "/teammembers/basutm2.webp",
};

function getAuthorAvatar(author: string): string {
  return authorAvatars[author] ?? "/brand/rov-logo.webp";
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
    <section
      style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/">
            <Image src="/brand/rov-logo.webp" alt="ROV Studios" width={48} height={48} style={{ objectFit: "contain" }} />
          </Link>
        </div>

        {/* Breadcrumb */}
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,244,227,0.55)",
            marginBottom: 28,
            fontFamily: "'Neue Montreal', sans-serif",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
          {" · "}
          <Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
          {post.category ? <>{" · "}{post.category}</> : null}
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}
        >
          {post.title}
        </h1>

        {post.description && (
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            {post.description}
          </p>
        )}

        {/* Author + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div
            style={{
              background: "#FFF4E3",
              border: "1px solid rgba(59,33,20,0.15)",
              borderRadius: 100,
              padding: "5px 14px 5px 5px",
              fontSize: 13,
              color: "#3B2114",
              fontFamily: "'Neue Montreal', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <Image src={getAuthorAvatar(post.author)} alt={post.author} fill style={{ objectFit: "cover" }} />
            </div>
            <span>
              <a href="/about" style={{ color: "#3B2114", textDecoration: "none" }}>{post.author}</a>
              {post.authorRole ? <span style={{ color: "rgba(59,33,20,0.6)" }}>, {post.authorRole}</span> : null}
            </span>
          </div>
          <div style={{ color: "rgba(255,244,227,0.55)", fontSize: 13, fontFamily: "'Neue Montreal', sans-serif" }}>
            {formatDate(post.date)} · {post.readingTime} min read
          </div>
        </div>
      </div>
    </section>
  );
}
