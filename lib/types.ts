export interface ChatbotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  error?: string;
  details?: string;
}

export interface ChatbotRequest {
  message: string;
  timestamp?: string;
  source?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Optional shorter title for the <title> tag / OG (keeps SERP titles from
   *  truncating while the long, keyword-rich title stays as the on-page H1). */
  seoTitle?: string;
  description: string;
  author: string;
  /** Author's job title — emitted as Person.jobTitle in BlogPosting schema. */
  authorRole?: string;
  /** Link to the author's bio (e.g. /about) — strengthens E-E-A-T. */
  authorUrl?: string;
  date: string;
  dateModified: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  atlantaAngle: string;
  published: boolean;
  /** When set, this post is a listing stub for a page that lives elsewhere
   *  (e.g. a /web GEO landing page). The blog card links here and /blog/[slug]
   *  redirects here, so the card surfaces the page without duplicating it. */
  externalUrl?: string;
  coverImage?: string;
  content: string;
  htmlContent?: string;
  faqs?: { question: string; answer: string }[];
}