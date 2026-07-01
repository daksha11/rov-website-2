import Link from "next/link";

export function BlogPostCTA() {
  return (
    <section style={{ background: "#FFF4E3", padding: "16px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            background: "#FFF4E3",
            border: "1.5px solid rgba(59,33,20,0.15)",
            borderRadius: 16,
            padding: "48px 36px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.2,
              color: "#3B2114",
            }}
          >
            Want to know where your business is leaking revenue?
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(59,33,20,0.7)",
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            We run free audits for Atlanta businesses. We look at your site, your funnel, your search visibility. We find the gap. We show you exactly what to fix.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#90422C",
                color: "#FFF4E3",
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Book a free audit
            </a>
            <Link
              href="/web"
              style={{
                background: "transparent",
                color: "#3B2114",
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
                border: "1.5px solid rgba(59,33,20,0.25)",
              }}
            >
              See our web services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
