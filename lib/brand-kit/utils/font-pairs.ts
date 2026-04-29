import type { FontDefinition } from '@/lib/brand-kit/types';

export interface FontPair {
  id: string;
  name: string;
  display: FontDefinition;
  body: FontDefinition;
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'playfair-roboto',
    name: 'Playfair Display + Roboto',
    display: {
      name: 'Playfair Display',
      fallback: 'Georgia, serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
      weights: [400, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'Roboto',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
      weights: [300, 400, 500, 700],
      cssVariable: '--font-body',
    },
  },
  {
    id: 'geist-dmsans',
    name: 'Geist + DM Sans',
    display: {
      name: 'Geist',
      fallback: "'DM Sans', sans-serif",
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'DM Sans',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap',
      weights: [300, 400, 500],
      cssVariable: '--font-body',
    },
  },
  {
    id: 'inter-inter',
    name: 'Inter (Display + Body)',
    display: {
      name: 'Inter',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'Inter',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-body',
    },
  },
  {
    id: 'cormorant-lato',
    name: 'Cormorant Garamond + Lato',
    display: {
      name: 'Cormorant Garamond',
      fallback: 'Georgia, serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'Lato',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
      weights: [300, 400, 700],
      cssVariable: '--font-body',
    },
  },
  {
    id: 'sora-inter',
    name: 'Sora + Inter',
    display: {
      name: 'Sora',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'Inter',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap',
      weights: [300, 400, 500],
      cssVariable: '--font-body',
    },
  },
  {
    id: 'space-grotesk-work-sans',
    name: 'Space Grotesk + Work Sans',
    display: {
      name: 'Space Grotesk',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
      weights: [300, 400, 500, 600, 700],
      cssVariable: '--font-display',
    },
    body: {
      name: 'Work Sans',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap',
      weights: [300, 400, 500],
      cssVariable: '--font-body',
    },
  },
];
