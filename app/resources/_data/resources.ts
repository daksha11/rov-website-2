export type ResourceCategory = "Toolkit" | "Playbook" | "Guide" | "Signals" | "Blog";

export interface ResourceEntry {
  id: string;
  category: ResourceCategory;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  date: string;
  readingTime?: number;
  featured?: boolean;
  external?: boolean;
}

export const resourceEntries: ResourceEntry[] = [
  {
    id: "toolkit-web-dev",
    category: "Toolkit",
    title: "The Web Dev Toolkit: 8 Tools Worth Paying For (and What to Skip)",
    excerpt:
      "The stack we actually ship client sites with, what each tool replaces, and where beginners waste money.",
    href: "/resources/toolkits/web-dev",
    date: "2026-07-03",
    readingTime: 9,
    featured: true,
  },
  {
    id: "toolkit-design",
    category: "Toolkit",
    title: "The Design Toolkit: 8 Tools That Actually Ship Brands",
    excerpt:
      "What we reach for building a brand identity from scratch, and the myths that waste founders' money.",
    href: "/resources/toolkits/design",
    date: "2026-07-03",
    readingTime: 9,
    featured: true,
  },
  {
    id: "playbook-real-estate-agents",
    category: "Playbook",
    title: "What Real Estate Agents Actually Take Home (And Why)",
    excerpt:
      "Drag the sliders on a live commission calculator, map the industry ecosystem, and read what agents actually say about leads, money, and burnout.",
    href: "/resources/playbooks/real-estate-agents",
    date: "2026-07-03",
    readingTime: 12,
    featured: true,
  },
];
