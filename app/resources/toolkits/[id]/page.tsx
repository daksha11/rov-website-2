import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolkitArticleBody } from "../_components/ToolkitArticleBody";
import { webDevContent } from "../_content/web-dev";
import { designContent } from "../_content/design";
import type { ToolkitArticleContent } from "../_content/types";

const SITE_URL = "https://www.rovstudios.com";

const CONTENT_BY_ID: Record<string, ToolkitArticleContent> = {
  "web-dev": webDevContent,
  design: designContent,
};

function getContent(id: string): ToolkitArticleContent | undefined {
  return CONTENT_BY_ID[id];
}

export function generateStaticParams() {
  return [{ id: "web-dev" }, { id: "design" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const content = getContent(id);
  if (!content) {
    return { title: "Toolkit Not Found | ROV Studios" };
  }

  const url = `${SITE_URL}/resources/toolkits/${content.id}`;

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: content.seo.ogTitle,
      description: content.seo.ogDescription,
      url,
      type: "article",
      images: [content.seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.ogTitle,
      description: content.seo.ogDescription,
      images: [content.seo.ogImage],
    },
  };
}

function buildJsonLd(content: ToolkitArticleContent) {
  const url = `${SITE_URL}/resources/toolkits/${content.id}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "Article",
        headline: content.h1,
        description: content.seo.description,
        author: {
          "@type": "Person",
          name: content.authorName,
          jobTitle: content.authorRole,
          url: `${SITE_URL}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: "ROV Studios",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/brand/rov-logo.webp`,
          },
        },
        datePublished: content.dateISO,
        dateModified: content.dateISO,
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ROV Studios", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` },
          { "@type": "ListItem", position: 3, name: content.h1, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: content.quickStart.heading,
        description: content.quickStart.intro,
        step: content.quickStart.steps.map((step) => ({
          "@type": "HowToStep",
          position: step.number,
          name: step.title,
          text: step.tip ? `${step.body} ${step.tip}` : step.body,
        })),
      },
      {
        "@type": "ItemList",
        name: content.toolsSection.heading,
        description: content.toolsSection.intro,
        itemListElement: content.toolsSection.tools.map((tool, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: tool.name,
            applicationCategory: tool.category,
            description: tool.oneLiner || tool.description,
            url: tool.url,
          },
        })),
      },
    ],
  };
}

export default async function ToolkitArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = getContent(id);

  if (!content) {
    notFound();
  }

  const jsonLd = buildJsonLd(content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolkitArticleBody content={content} />
    </>
  );
}
