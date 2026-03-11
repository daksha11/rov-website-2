import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Bando Case Study | Range of View Studios',
    description: 'How we transformed The Bando\'s digital presence to match their bold, unapologetically Atlanta energy — cutting bounce rate by 60% through strategic design and cultural storytelling.',
    openGraph: {
        title: 'The Bando Case Study | Range of View Studios',
        description: 'How we transformed The Bando\'s digital presence to match their bold, unapologetically Atlanta energy — cutting bounce rate by 60%.',
        images: [{ url: '/casestudy/Evertriedcrack.jpeg', width: 1200, height: 630, alt: 'The Bando Case Study' }],
        type: 'article',
        url: 'https://rovstudios.com/casestudy/bando',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Bando Case Study | Range of View Studios',
        description: 'How we transformed The Bando\'s digital presence to match their bold, unapologetically Atlanta energy — cutting bounce rate by 60%.',
        images: ['/casestudy/Evertriedcrack.jpeg'],
    },
};

export default function BandoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
