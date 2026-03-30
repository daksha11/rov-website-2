export function BlogPostBody({ htmlContent }: { htmlContent: string }) {
  return (
    <>
      <div
        className="blog-content mx-auto max-w-[720px] px-5 pb-16"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <style>{`
        .blog-content h2 {
          font-family: Norwige, sans-serif;
          font-size: 1.75rem;
          line-height: 1.3;
          color: #ffffff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }

        .blog-content h3 {
          font-family: Norwige, sans-serif;
          font-size: 1.375rem;
          line-height: 1.35;
          color: #ffffff;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .blog-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .blog-content p {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #d1d5db;
          margin-bottom: 1.25rem;
        }

        .blog-content ul,
        .blog-content ol {
          color: #d1d5db;
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .blog-content ul {
          list-style-type: disc;
        }

        .blog-content ol {
          list-style-type: decimal;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
        }

        .blog-content strong,
        .blog-content b {
          color: #ffffff;
          font-weight: 600;
        }

        .blog-content a {
          color: #60a5fa;
          text-decoration: none;
          transition: text-decoration 0.15s;
        }

        .blog-content a:hover {
          text-decoration: underline;
        }

        .blog-content blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #9ca3af;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .blog-content pre {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.25rem;
        }

        .blog-content code {
          font-size: 0.9375rem;
          color: #e5e7eb;
        }

        .blog-content p code {
          background: rgba(255, 255, 255, 0.08);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin: 2rem 0;
        }
      `}</style>
    </>
  );
}
