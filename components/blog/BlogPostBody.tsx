export function BlogPostBody({ htmlContent }: { htmlContent: string }) {
  return (
    <>
      <div
        className="blog-content mx-auto max-w-[720px] px-6 pt-12 pb-16"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h2 {
          font-family: Norwige, sans-serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 400;
          line-height: 1.2;
          color: #90422C;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
        }

        .blog-content h3 {
          font-family: Norwige, sans-serif;
          font-size: clamp(1.25rem, 4vw, 1.5rem);
          font-weight: 400;
          line-height: 1.35;
          color: #90422C;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .blog-content h4 {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(1rem, 3vw, 1.125rem);
          font-weight: 700;
          color: #B16937;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .blog-content p {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(1rem, 2vw, 1.0625rem);
          line-height: 1.75;
          color: #3B2114;
          margin-bottom: 1.25rem;
        }

        .blog-content ul,
        .blog-content ol {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #3B2114;
          font-size: clamp(1rem, 2vw, 1.0625rem);
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
          color: #3B2114;
          font-weight: 700;
        }

        .blog-content a {
          color: #90422C;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.15s;
        }

        .blog-content a:hover {
          color: #B16937;
        }

        .blog-content blockquote {
          background: rgba(234, 154, 97, 0.08);
          border-left: 4px solid #EA9A61;
          padding: 1.5rem 1.75rem;
          border-radius: 0 8px 8px 0;
          margin: 2rem 0;
          font-family: Norwige, sans-serif;
          font-style: italic;
          font-size: 1.375rem;
          line-height: 1.5;
          color: #3B2114;
        }

        .blog-content blockquote p {
          font-family: Norwige, sans-serif;
          font-size: 1.375rem;
          color: #3B2114;
          margin: 0;
        }

        .blog-content img {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
          display: block;
        }

        .blog-content pre {
          background: rgba(59, 33, 20, 0.05);
          border: 1px solid rgba(59, 33, 20, 0.12);
          border-radius: 0.5rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.25rem;
          font-size: clamp(0.875rem, 2vw, 0.9375rem);
        }

        .blog-content code {
          font-size: clamp(0.8125rem, 2vw, 0.9375rem);
          color: #3B2114;
          font-family: 'Courier New', monospace;
        }

        .blog-content p code {
          background: rgba(144, 66, 44, 0.1);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(59, 33, 20, 0.12);
          margin: 2rem 0;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: clamp(0.875rem, 2vw, 0.9375rem);
          display: block;
          overflow-x: auto;
        }

        .blog-content thead tr {
          background: #3B2114;
        }

        .blog-content th {
          padding: 12px 16px;
          text-align: left;
          color: #FFF4E3;
          font-family: 'Neue Montreal', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .blog-content td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(59, 33, 20, 0.08);
          color: #3B2114;
        }

        .blog-content tbody tr:nth-child(odd) {
          background: rgba(59, 33, 20, 0.04);
        }

        @media (max-width: 640px) {
          .blog-content h2 {
            margin-top: 2rem;
          }

          .blog-content h3 {
            margin-top: 1.5rem;
          }
        }
      ` }} />
    </>
  );
}
