import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaybookBody } from "../_components/PlaybookBody";
import { realEstateAgentsPlaybook } from "../_content/real-estate-agents";
import type { PlaybookContent } from "../_content/types";

const SITE_URL = "https://www.rovstudios.com";

const CONTENT_BY_SLUG: Record<string, PlaybookContent> = {
  "real-estate-agents": realEstateAgentsPlaybook,
};

function getContent(slug: string): PlaybookContent | undefined {
  return CONTENT_BY_SLUG[slug];
}

export function generateStaticParams() {
  return [{ slug: "real-estate-agents" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getContent(slug);
  if (!content) {
    return { title: "Playbook Not Found | ROV Studios" };
  }

  const url = `${SITE_URL}/resources/playbooks/${content.slug}`;

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

function buildJsonLd(content: PlaybookContent) {
  const url = `${SITE_URL}/resources/playbooks/${content.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
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
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getContent(slug);

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
      <PlaybookBody content={content} />
    </>
  );
}
