import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DKM Corp Case Study | Range of View Studios',
    description: 'A comprehensive brand identity and digital infrastructure project for DKM Corp, a private growth and operations partner spanning India, Australia, the US, and Dubai.',
    openGraph: {
        title: 'DKM Corp Case Study | Range of View Studios',
        description: 'How we built a global-facing digital hub for DKM Corp — achieving 100% execution across four primary markets.',
        images: [{ url: '/og/og-dkm.webp', width: 1200, height: 630, alt: 'DKM Corp Case Study' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/dkm',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DKM Corp Case Study | Range of View Studios',
        description: 'How we built a global-facing digital hub for DKM Corp — achieving 100% execution across four primary markets.',
        images: ['/og/og-dkm.webp'],
    },
};

export default function DkmLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
