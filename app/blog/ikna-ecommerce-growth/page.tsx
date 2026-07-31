"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import BlogLeadForm from "@/components/blog/BlogLeadForm";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });


const TOC = [
  { id: "the-challenge", label: "An Atlanta small business with no digital presence" },
  { id: "the-solution", label: "What we actually built" },
  { id: "the-results", label: "The numbers" },
  { id: "the-takeaway", label: "What this means for Atlanta small businesses" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "+20%", label: "Total sales increase", sub: "from a brand-new channel" },
  { number: "$0 → Live", label: "Online revenue", sub: "built from nothing" },
  { number: "6M+", label: "Atlanta metro reach", sub: "customers now in range" },
];

const STEPS = [
  {
    n: "01",
    title: "Brand identity first",
    body: "Before we touched a line of code, we sat down with Aysegul to define her brand's visual language and voice. This matters more than most people think. When a business goes from zero online presence to a full digital storefront, everything a customer sees needs to feel intentional. We developed the color palette, typography, photography direction, and tone of voice that would carry across every platform.",
  },
  {
    n: "02",
    title: "E-commerce built for a first-time seller",
    body: "We designed and built an online store Aysegul could actually manage herself. Too many agencies ship beautiful stores the owner cannot update without calling a developer. We set up the product catalog, payment processing, shipping configuration, and inventory management in a way that made sense for a one-person operation. She needed to add products, adjust prices, and fulfill orders without a tutorial every time.",
  },
  {
    n: "03",
    title: "Social media as a growth engine",
    body: "A website without traffic is just a brochure. We took over social media marketing and account management to drive real visitors to the new shop. That meant content planning, a consistent posting schedule, audience engagement, and paid promotion where it made sense. The social accounts became the front door to the website, not just a vanity presence.",
  },
  {
    n: "04",
    title: "Photography & content direction",
    body: "Product photography can make or break an e-commerce website. We directed the visual content so every product looked as good on screen as it did in person. Consistent lighting, clean backgrounds, and lifestyle shots that showed the products in context, not just flat lays on a white table.",
  },
];

const FAQS = [
  {
    q: "How much does it cost to build an e-commerce website for a small business?",
    a: "For a small business e-commerce build like Aysegul's, including brand identity, product photography direction, and a fully functional online store, our projects at ROV Studios typically start in the low-to-mid four figures and scale up based on catalog size and custom features. The 20% sales increase Aysegul saw means the project paid for itself quickly.",
  },
  {
    q: "How long does it take to build an e-commerce website?",
    a: "A full e-commerce website design build from brand identity through launch usually takes 6 to 10 weeks. Aysegul's project included branding, website design and development, e-commerce setup, and social media onboarding. The timeline depends on product catalog size, how quickly product photography can be completed, and how many revision rounds are needed.",
  },
  {
    q: "What platform works best for small business e-commerce?",
    a: "There is no single right answer. It depends on your products, technical comfort, and budget. For small business owners in Atlanta who need to manage their own store day to day, we typically recommend platforms that balance flexibility with ease of use. We evaluate each client's needs individually rather than forcing everyone onto the same platform.",
  },
  {
    q: "Does going online actually increase sales for a physical business?",
    a: "Yes, and Aysegul Ikna's 20% sales increase is proof. Before the project she had zero online revenue, and every sale required a customer to walk into her physical store. After launching the e-commerce website with integrated social media marketing and professional product photography, online channels that did not previously exist drove a 20% increase in total sales on top of her existing in-person revenue. Going online does not replace your physical business. It extends your reach to customers who would never have walked through your door.",
  },
];

export default function IknaEcommerceGrowthPage() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/">
              <Image src="/brand/rov-logo.webp" alt="ROV Studios" width={48} height={48} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          {/* Breadcrumb */}
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,227,0.55)", marginBottom: 28, fontFamily: "'Neue Montreal', sans-serif" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
            {" · "}
            <Link href="/web" style={{ color: "inherit", textDecoration: "none" }}>Web Design</Link>
            {" · "}Atlanta E-Commerce
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            From Zero Online Sales to 20% Revenue Growth: An Atlanta E-Commerce Case Study
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Aysegul Ikna ran a real business with a real reputation and zero online presence. We built her brand identity, her e-commerce store, and her social channels from nothing. The result was <a href="https://aysegulikna.com" target="_blank" rel="noopener noreferrer" style={{ color: "#EA9A61", textDecoration: "underline" }}>aysegulikna.com</a> and a completely new revenue stream. This is how a sustainable fashion brand at Ponce City Market went from foot traffic to a 20% sales lift.
          </p>

          {/* Author + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
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
            }}>
              <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image src="/teammembers/basutm2.webp" alt="Ayush Basu" fill sizes="32px" style={{ objectFit: "cover" }} />
              </div>
              Ayush Basu · Founder &amp; Creative Director, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>March 2026 · 5 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.number} style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{
                fontFamily: "Norwige, sans-serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: 8,
              }}>{s.number}</div>
              <div style={{ color: "#FFF4E3", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: "rgba(255,244,227,0.85)", fontSize: 12 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Table of Contents */}
        <nav style={{
          background: "rgba(144,66,44,0.07)",
          border: "1.5px solid rgba(144,66,44,0.25)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#90422C", fontWeight: 700, marginBottom: 16 }}>
            In this article
          </p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {TOC.map((item, i) => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#EA9A61", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${item.id}`} style={{ color: "#3B2114", textDecoration: "none", fontSize: 15, borderBottom: "1px solid rgba(59,33,20,0.15)", lineHeight: 1.4 }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── SECTION 1: The Challenge ── */}
        <section id="the-challenge" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            An Atlanta small business with no digital presence
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Aysegul Ikna built a sustainable fashion brand out of Ponce City Market. The product was great, the reputation was solid, and customers who found her left loyal. But the business only existed in person. No website. No e-commerce shop. No social strategy beyond the occasional post. Every sale required a customer to physically show up or already know who she was.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            That works, until it doesn&apos;t. Atlanta&apos;s small business landscape is crowded. The metro area has over 500,000 small businesses, and more launch every year. Leaning only on foot traffic and word of mouth puts a hard ceiling on growth. Aysegul knew she was leaving money on the table. She just needed someone to build the table.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The real challenge was never a single website. It was building an entire digital brand identity from nothing: brand presence, online shop, social channels, content. And making all of it feel cohesive and authentic to who she already was. That is exactly the kind of build our <Link href="/web" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>Atlanta web design</Link> work is made for.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/ikna/fashion1ikna.webp" alt="Aysegul Ikna sustainable fashion show at Ponce City Market with models walking the runway" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            Aysegul Ikna&apos;s runway show at Ponce City Market, Atlanta.
          </div>
        </div>

        {/* Pull quote */}
        <blockquote style={{
          margin: "0 0 64px",
          padding: "24px 28px",
          borderLeft: "4px solid #EA9A61",
          background: "rgba(234,154,97,0.08)",
          borderRadius: "0 8px 8px 0",
        }}>
          <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
            &ldquo;She did not lose in-person sales. She added a completely new revenue stream on top of what she was already doing.&rdquo;
          </p>
        </blockquote>

        {/* ── SECTION 2: The Solution ── */}
        <section id="the-solution" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What we actually built
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four moving parts. One connected system. See the full breakdown on the <Link href="/casestudy/ikna" style={{ color: "#B16937" }}>Aysegul Ikna case study page</Link>.
          </p>

          {STEPS.map((item) => (
            <div key={item.n} style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: 20,
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: "1px solid rgba(59,33,20,0.1)",
            }}>
              <div style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#EA9A61",
                paddingTop: 4,
                letterSpacing: "0.05em",
              }}>{item.n}</div>
              <div>
                <h3 style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, fontWeight: 700, color: "#B16937", marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/ikna/fashion2.webp" alt="Models showcasing Aysegul Ikna sustainable fashion designs at the Ponce City Market runway event" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
        </div>

        {/* Stat callout */}
        <div style={{
          background: "#3B2114",
          borderRadius: 12,
          padding: "28px 32px",
          margin: "0 0 64px",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "24px",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(40px, 10vw, 56px)",
            background: "linear-gradient(135deg, #EA9A61, #90422C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}>500K+</div>
          <div>
            <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Metro Atlanta is home to over 500,000 small businesses, all competing for the same customers. A brand with no online storefront is invisible to every one of those searches. Building the digital presence is how you get counted.
            </p>
            <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: Metro Atlanta Chamber</p>
          </div>
        </div>

        {/* ── SECTION 3: The Results ── */}
        <section id="the-results" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The numbers
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Within the first months of going live, Aysegul saw a 20% increase in total sales. That new revenue came entirely from online channels that did not exist before we started. She kept every in-person sale she already had and stacked a new stream on top.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The social accounts grew from inactive to engaged, driving steady traffic to the shop. The e-commerce website gave her credibility with new customers who discovered her online, browsed the brand, and purchased without ever walking into a physical location.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            For a business that started at zero digital revenue, a 20% bump in total sales from a brand-new channel is significant. It means the online presence is not supplemental. It is becoming a core part of the business.
          </p>
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/ikna/ikna4.webp" alt="Aysegul Ikna with guests celebrating the sustainable fashion show launch at Ponce City Market" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            Launch night for the Aysegul Ikna brand at Ponce City Market.
          </div>
        </div>

        {/* ── SECTION 4: The Takeaway ── */}
        <section id="the-takeaway" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta small businesses
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Starting from zero is not a disadvantage. It is a clean slate. When there is no existing website to work around, no outdated branding to negotiate, and no legacy systems to migrate, we build everything right the first time. Aysegul&apos;s project moved faster because we were not fixing old problems.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The website is only half the job. An online store with no plan to drive traffic to it is a waste of money. Social media, content, and ongoing marketing are what turn a website from a cost center into a revenue generator. For a metro of over 6 million people, that reach is the whole point. We handled all of it as one connected system.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            And it has to stay manageable. Atlanta small business owners wear every hat. The tools we build need to fit into a busy day, not add to it. See how we approach that in our <Link href="/casestudy/ikna" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>full Aysegul Ikna case study</Link>.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Aysegul Ikna had a strong physical business and zero online revenue. ROV built her brand identity, e-commerce store, product photography direction, and social presence from scratch. Online channels that did not previously exist drove a 20% increase in total sales, all on top of her existing in-person business. Going online did not replace the store. It extended her reach to customers who would never have walked through the door.
            </p>
          </div>
        </section>

        {/* ── IMAGE 4 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/ikna/modelpics.webp" alt="Models presenting Aysegul Ikna's sustainable fashion collection at the Ponce City Market store" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
        </div>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/casestudy/ikna", label: "Full Aysegul Ikna case study", desc: "The complete brand and e-commerce build. Every decision, every asset, the full rollout." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta e-commerce sites and brands. Pricing, timeline, and what to expect." },
              { href: "/blog/restaurant-atlanta", label: "Every restaurant is bleeding revenue online", desc: "How a buried ordering page cost one Atlanta restaurant thousands, and how we fixed it." },
              { href: "/web/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 prices, what moves them, and what a cheap site really costs you later." },
              { href: "/web/why-isnt-my-business-showing-up-on-google", label: "Why isn't my business showing up on Google?", desc: "The six reasons Atlanta businesses stay invisible in local search, and how to fix each one." },
              { href: "/ctrla", label: "CTRL-A by ROV Studios", desc: "Our editorial arm covering creative direction, design systems, and the Atlanta creative scene." },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start", textDecoration: "none", padding: "16px 0", borderBottom: "1px solid rgba(59,33,20,0.07)" }}>
                <span style={{ color: "#EA9A61", fontSize: 16, marginTop: 2 }}>→</span>
                <span>
                  <span style={{ display: "block", color: "#90422C", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{link.label}</span>
                  <span style={{ color: "rgba(59,33,20,0.6)", fontSize: 14, lineHeight: 1.5 }}>{link.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ── FAQ ── */}
      <BlogFAQ faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── AUTHOR ── */}
        <section style={{ marginBottom: 64, padding: "28px 32px", background: "#3B2114", borderRadius: 16, color: "#FFF4E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(234,154,97,0.4)" }}>
              <Image src="/teammembers/basutm2.webp" alt="Ayush Basu, Founder and Creative Director at ROV Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Ayush Basu</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Founder &amp; Creative Director, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; March 30, 2026
            </p>
          </div>
        </section>

        {/* ── LEAD FORM CTA ── */}
        <BlogLeadForm
          source="blog:ikna-ecommerce-growth"
          heading="Ready to build your online store from scratch?"
          subheading="We run free audits for Atlanta small businesses. Tell us what you're selling and we'll show you the revenue you're leaving on the table."
          messagePlaceholder="What you sell, where you sell it now, and what you're trying to grow..."
          secondaryHref="https://cal.com/rov-studios-imhphw/15min"
          secondaryLabel="Prefer to talk? Book a free audit call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
