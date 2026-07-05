import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVolume, volumeNumbers } from "../../_volumes";
import VolArchiveContent from "./VolArchiveContent";

export function generateStaticParams() {
  return volumeNumbers.map((n) => ({ n: String(n) }));
}

export function generateMetadata({ params }: { params: { n: string } }): Metadata {
  const n = Number(params.n);
  const volume = getVolume(n);
  if (!volume) return { title: "Back issue — CTRL A" };

  const { issueMeta } = volume;
  const canonical = `https://www.rovstudios.com/ctrla/vol/${n}`;
  const title = `CTRL A ${issueMeta.volume} — ${issueMeta.edition} | Range of View`;
  const description = `${issueMeta.volume} of CTRL A, the ${issueMeta.edition} back issue from Range of View Studios. ${issueMeta.coverDeck}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function VolArchivePage({ params }: { params: { n: string } }) {
  const n = Number(params.n);
  if (!Number.isInteger(n) || !getVolume(n)) notFound();
  return <VolArchiveContent n={n} />;
}
