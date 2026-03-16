import type { ComponentType } from "react";

/* ═══════════════════════════════════════════════════════
   SHARED TYPES
   ═══════════════════════════════════════════════════════ */

export interface NavSection {
    id: string;
    label: string;
}

export interface TabConfig {
    id: string;
    label: string;
    component: ComponentType<{ chartReady: boolean }>;
    navSections: NavSection[];
}

export interface MarketStat {
    value: number;
    suffix: string;
    prefix: string;
    label: string;
    sub: string;
}

export interface Competitor {
    name: string;
    brand: "yes" | "no" | "partial";
    web: "yes" | "no" | "partial";
    ai: "yes" | "no" | "partial";
    sound: "yes" | "no" | "partial";
    stage: "yes" | "no" | "partial";
}

export interface SoundPricing {
    name: string;
    price: string;
    priceNum: number;
    turnaround: string;
    rush: string;
}

export interface SoundTier {
    tier: string;
    price: string;
    features: string;
    delivery: string;
}

export interface EventRetainer {
    tier: string;
    price: string;
    features: string[];
}

export interface AgencyPricing {
    tier: string;
    brand: string;
    website: string;
    full: string;
}

export interface Persona {
    name: string;
    role: string;
    age: string;
    location: string;
    budget: string;
    pain: string;
    win: string;
}

export interface PainPointSegment {
    label: string;
    items: { pain: string; pct: number }[];
}

export interface VCComp {
    name: string;
    raised: string;
    revenue: string;
    model: string;
}

export interface ATLVC {
    name: string;
    check: string;
    focus: string;
}

export interface InvestorMetric {
    metric: string;
    target: string;
}

export interface Trend {
    title: string;
    stat: string;
    statLabel: string;
    detail: string;
}

export interface LeadChannel {
    channel: string;
    detail: string;
    roi: number;
    time: string;
}
