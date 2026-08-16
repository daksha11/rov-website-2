// HowTo structured data — describes a process as ordered steps so search and
// AI answer engines can surface it (e.g. "how does ROV build a website").
// Use for service "process" sections and how-we-built-it content.

export type HowToStep = { name: string; text: string };

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  url,
  baseUrl = "https://www.rovstudios.com",
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  /** ISO 8601 duration, e.g. "P6W" for six weeks. Optional. */
  totalTime?: string;
  url: string;
  /** This app serves two domains. Music-host pages must not emit step anchors
   *  pointing at rovstudios, or the steps resolve to URLs that do not exist. */
  baseUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${baseUrl}${url}#step-${i + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
