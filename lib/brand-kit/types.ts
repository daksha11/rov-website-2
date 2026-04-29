export interface BrandKitData {
  brandInfo: BrandInfo;
  logos: LogoSet;
  colors: ColorPalette;
  typography: TypographyConfig;
  gradients: GradientDefinition[];
  voice: BrandVoice;
  sections: SectionConfig[];
  template: TemplateId;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  website: string;
  version: string;
  year: string;
  confidentialityNote: string;
}

export interface LogoSet {
  variants: LogoVariant[];
}

export interface LogoVariant {
  id: string;
  label: string;
  file: string; // base64 data URL
  format: 'png' | 'svg';
  backgroundPresets: BackgroundPreset[];
  defaultBackground: string;
  blendMode: 'normal' | 'multiply' | 'screen';
}

export interface BackgroundPreset {
  label: string;
  color: string;
}

export interface ColorPalette {
  swatches: ColorSwatch[];
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  role: string;
  cssVariable: string;
}

export interface TypographyConfig {
  displayFont: FontDefinition;
  bodyFont: FontDefinition;
  scale: TypeScaleEntry[];
}

export interface FontDefinition {
  name: string;
  fallback: string;
  googleFontsUrl: string;
  weights: number[];
  cssVariable: string;
  customFontData?: string;
  customFontFormat?: 'woff2' | 'woff' | 'ttf' | 'otf';
}

export interface TypeScaleEntry {
  label: string;
  fontFamily: 'display' | 'body';
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  lineHeight: string;
  textTransform: string;
  sampleText: string;
}

export interface GradientDefinition {
  id: string;
  name: string;
  css: string;
  isPrimary: boolean;
}

export interface BrandVoice {
  pillars: VoicePillar[];
  doExamples: string[];
  dontExamples: string[];
  weAre: string[];
  weAreNot: string[];
}

export interface VoicePillar {
  id: string;
  label: string;
  word: string;
  description: string;
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  enabled: boolean;
  order: number;
}

export type SectionId =
  | 'logo'
  | 'typography'
  | 'colors'
  | 'gradients'
  | 'usage'
  | 'thumbnails'
  | 'webcam'
  | 'voice';

export type TemplateId = 'warm-earth' | 'corporate-blue';

export interface BrandKitTemplate {
  id: TemplateId;
  name: string;
  description: string;
  navigationStyle: 'pill' | 'side-dots';
  coverOverlay: 'grain' | 'grid' | 'none';
}
