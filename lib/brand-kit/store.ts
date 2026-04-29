import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  BrandKitData,
  BrandInfo,
  LogoVariant,
  ColorSwatch,
  TypographyConfig,
  GradientDefinition,
  BrandVoice,
  SectionConfig,
  SectionId,
  TemplateId,
} from './types';

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'logo', label: 'Logo & Mark', enabled: true, order: 0 },
  { id: 'typography', label: 'Typography', enabled: true, order: 1 },
  { id: 'colors', label: 'Color Palette', enabled: true, order: 2 },
  { id: 'gradients', label: 'Gradients', enabled: true, order: 3 },
  { id: 'usage', label: 'Usage Examples', enabled: false, order: 4 },
  { id: 'thumbnails', label: 'Thumbnails', enabled: false, order: 5 },
  { id: 'webcam', label: 'Webcam Frames', enabled: false, order: 6 },
  { id: 'voice', label: 'Brand Voice', enabled: true, order: 7 },
];

const DEFAULT_DATA: BrandKitData = {
  brandInfo: {
    name: '',
    tagline: '',
    website: '',
    version: 'v1.0',
    year: new Date().getFullYear().toString(),
    confidentialityNote: 'Internal Use Only',
  },
  logos: { variants: [] },
  colors: { swatches: [] },
  typography: {
    displayFont: {
      name: 'Playfair Display',
      fallback: 'Georgia, serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
      weights: [400, 700],
      cssVariable: '--font-display',
    },
    bodyFont: {
      name: 'Roboto',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
      weights: [300, 400, 500, 700],
      cssVariable: '--font-body',
    },
    scale: [
      {
        label: 'Display',
        fontFamily: 'display',
        fontSize: '52px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: '1.1',
        textTransform: 'none',
        sampleText: 'Brand Display',
      },
      {
        label: 'H1',
        fontFamily: 'display',
        fontSize: '36px',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: '1.2',
        textTransform: 'none',
        sampleText: 'Heading One',
      },
      {
        label: 'H2',
        fontFamily: 'display',
        fontSize: '26px',
        fontWeight: 400,
        letterSpacing: '0',
        lineHeight: '1.3',
        textTransform: 'none',
        sampleText: 'Heading Two',
      },
      {
        label: 'Body',
        fontFamily: 'body',
        fontSize: '16px',
        fontWeight: 300,
        letterSpacing: '0',
        lineHeight: '1.7',
        textTransform: 'none',
        sampleText:
          'Body text for paragraphs and general content across all brand materials.',
      },
      {
        label: 'Label',
        fontFamily: 'body',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.2em',
        lineHeight: '1',
        textTransform: 'uppercase',
        sampleText: 'LABEL TEXT',
      },
      {
        label: 'Caption',
        fontFamily: 'body',
        fontSize: '12px',
        fontWeight: 300,
        letterSpacing: '0.05em',
        lineHeight: '1.4',
        textTransform: 'none',
        sampleText: 'Caption or footnote text',
      },
    ],
  },
  gradients: [],
  voice: {
    pillars: [],
    doExamples: [],
    dontExamples: [],
    weAre: [],
    weAreNot: [],
  },
  sections: DEFAULT_SECTIONS,
  template: 'warm-earth',
};

interface BrandKitStore {
  data: BrandKitData;
  currentStep: number;

  setBrandInfo: (info: Partial<BrandInfo>) => void;
  addLogo: (logo: LogoVariant) => void;
  removeLogo: (id: string) => void;
  updateLogo: (id: string, updates: Partial<LogoVariant>) => void;
  addColor: (swatch: ColorSwatch) => void;
  updateColor: (id: string, updates: Partial<ColorSwatch>) => void;
  removeColor: (id: string) => void;
  reorderColors: (swatches: ColorSwatch[]) => void;
  setTypography: (config: Partial<TypographyConfig>) => void;
  updateScaleEntry: (index: number, updates: Partial<BrandKitData['typography']['scale'][0]>) => void;
  addGradient: (gradient: GradientDefinition) => void;
  updateGradient: (id: string, updates: Partial<GradientDefinition>) => void;
  removeGradient: (id: string) => void;
  setVoice: (voice: Partial<BrandVoice>) => void;
  toggleSection: (id: SectionId) => void;
  reorderSections: (sections: SectionConfig[]) => void;
  setTemplate: (template: TemplateId) => void;
  setStep: (step: number) => void;
  reset: () => void;
  loadSample: (
    partial: Partial<Pick<BrandKitData, "brandInfo" | "colors" | "gradients" | "voice">>
  ) => void;
}

export const useBrandKitStore = create<BrandKitStore>()(
  immer((set) => ({
    data: DEFAULT_DATA,
    currentStep: 0,

    setBrandInfo: (info) =>
      set((state) => {
        Object.assign(state.data.brandInfo, info);
      }),

    addLogo: (logo) =>
      set((state) => {
        state.data.logos.variants.push(logo);
      }),

    removeLogo: (id) =>
      set((state) => {
        state.data.logos.variants = state.data.logos.variants.filter(
          (v) => v.id !== id
        );
      }),

    updateLogo: (id, updates) =>
      set((state) => {
        const logo = state.data.logos.variants.find((v) => v.id === id);
        if (logo) Object.assign(logo, updates);
      }),

    addColor: (swatch) =>
      set((state) => {
        state.data.colors.swatches.push(swatch);
      }),

    updateColor: (id, updates) =>
      set((state) => {
        const swatch = state.data.colors.swatches.find((s) => s.id === id);
        if (swatch) Object.assign(swatch, updates);
      }),

    removeColor: (id) =>
      set((state) => {
        state.data.colors.swatches = state.data.colors.swatches.filter(
          (s) => s.id !== id
        );
      }),

    reorderColors: (swatches) =>
      set((state) => {
        state.data.colors.swatches = swatches;
      }),

    setTypography: (config) =>
      set((state) => {
        if (config.displayFont)
          Object.assign(state.data.typography.displayFont, config.displayFont);
        if (config.bodyFont)
          Object.assign(state.data.typography.bodyFont, config.bodyFont);
        if (config.scale) state.data.typography.scale = config.scale;
      }),

    updateScaleEntry: (index, updates) =>
      set((state) => {
        const entry = state.data.typography.scale[index];
        if (entry) Object.assign(entry, updates);
      }),

    addGradient: (gradient) =>
      set((state) => {
        state.data.gradients.push(gradient);
      }),

    updateGradient: (id, updates) =>
      set((state) => {
        const gradient = state.data.gradients.find((g) => g.id === id);
        if (gradient) Object.assign(gradient, updates);
      }),

    removeGradient: (id) =>
      set((state) => {
        state.data.gradients = state.data.gradients.filter((g) => g.id !== id);
      }),

    setVoice: (voice) =>
      set((state) => {
        Object.assign(state.data.voice, voice);
      }),

    toggleSection: (id) =>
      set((state) => {
        const section = state.data.sections.find((s) => s.id === id);
        if (section) section.enabled = !section.enabled;
      }),

    reorderSections: (sections) =>
      set((state) => {
        state.data.sections = sections;
      }),

    setTemplate: (template) =>
      set((state) => {
        state.data.template = template;
      }),

    setStep: (step) =>
      set((state) => {
        state.currentStep = step;
      }),

    reset: () =>
      set((state) => {
        state.data = DEFAULT_DATA;
        state.currentStep = 0;
      }),

    loadSample: (partial) =>
      set((state) => {
        if (partial.brandInfo)
          Object.assign(state.data.brandInfo, partial.brandInfo);
        if (partial.colors) state.data.colors = partial.colors;
        if (partial.gradients) state.data.gradients = partial.gradients;
        if (partial.voice) state.data.voice = partial.voice;
      }),
  }))
);
