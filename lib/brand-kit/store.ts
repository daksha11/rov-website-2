import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
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

/**
 * localStorage key for the working brand kit. Bump `version` in the persist
 * config (not this string) if the persisted shape ever changes incompatibly.
 */
export const BRAND_KIT_STORAGE_KEY = 'ctrl-a-brand-kit';

/**
 * Quota-safe localStorage adapter.
 *
 * The kit can hold large base64 data URLs (uploaded logos in
 * `logos.variants[].file`, and embedded custom fonts in
 * `typography.*.customFontData`). localStorage caps around ~5MB, so a full
 * write can throw QuotaExceededError. Rather than let that crash the app — or
 * lose ALL of the user's work — we catch the failure and retry with just the
 * heavy binary blobs stripped. That guarantees the lightweight, high-value
 * work (brand info, colors, typography config, gradients, voice, sections,
 * current step) always survives a refresh; only the oversized images get
 * dropped when they genuinely can't fit.
 */
const quotaSafeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Almost certainly a quota error. Retry with the binary blobs stripped
      // so everything else is still saved.
      try {
        const parsed = JSON.parse(value);
        const d = parsed?.state?.data as BrandKitData | undefined;
        if (d) {
          if (d.logos?.variants) {
            d.logos.variants = d.logos.variants.map((v) => ({ ...v, file: '' }));
          }
          if (d.typography?.displayFont) delete d.typography.displayFont.customFontData;
          if (d.typography?.bodyFont) delete d.typography.bodyFont.customFontData;
        }
        window.localStorage.setItem(name, JSON.stringify(parsed));
      } catch {
        // Persistence is best-effort — never throw out of a store write.
      }
    }
  },
  removeItem: (name) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(name);
    } catch {
      /* no-op */
    }
  },
};

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
      name: 'Instrument Serif',
      fallback: 'Georgia, serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
      weights: [400],
      cssVariable: '--font-display',
    },
    bodyFont: {
      name: 'Space Grotesk',
      fallback: 'sans-serif',
      googleFontsUrl:
        'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap',
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
    partial: Partial<Pick<BrandKitData, "brandInfo" | "logos" | "colors" | "gradients" | "voice">>
  ) => void;
  loadKit: (
    kit: Pick<
      BrandKitData,
      "brandInfo" | "colors" | "typography" | "gradients" | "voice" | "sections" | "template"
    >
  ) => void;
  /** Load a complete saved kit (logos + fonts included), for resuming from /account. */
  loadFullKit: (data: BrandKitData) => void;
}

export const useBrandKitStore = create<BrandKitStore>()(
  persist(
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
        if (partial.logos) state.data.logos = partial.logos;
        if (partial.colors) state.data.colors = partial.colors;
        if (partial.gradients) state.data.gradients = partial.gradients;
        if (partial.voice) state.data.voice = partial.voice;
      }),

    // Drop a shared kit into the builder so "Remix this kit" works. Shared
    // links never carry logos or embedded fonts, so those are cleared here.
    loadKit: (kit) =>
      set((state) => {
        Object.assign(state.data.brandInfo, kit.brandInfo);
        state.data.colors = kit.colors;
        state.data.typography = kit.typography;
        state.data.gradients = kit.gradients;
        state.data.voice = kit.voice;
        state.data.sections = kit.sections;
        state.data.template = kit.template;
        state.data.logos = { variants: [] };
      }),

    // Load a complete saved kit as-is. Unlike loadKit (share links), this
    // keeps logos + embedded fonts, since a member's own saved kit carries them.
    loadFullKit: (data) =>
      set((state) => {
        state.data = data;
        state.currentStep = 0;
      }),
  })),
    {
      name: BRAND_KIT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => quotaSafeStorage),
      // Only persist the user's working data + position. Ephemeral action
      // functions are recreated by the store on every load.
      partialize: (state) => ({ data: state.data, currentStep: state.currentStep }),
      // Client-only tool. Skip automatic hydration so the first client render
      // matches the server-rendered defaults (no SSR mismatch), then rehydrate
      // explicitly after mount — see the builder layout's useEffect.
      skipHydration: true,
    }
  )
);
