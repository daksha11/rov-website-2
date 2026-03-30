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
  description: string;
  author: string;
  date: string;
  dateModified: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  atlantaAngle: string;
  published: boolean;
  content: string;
  htmlContent?: string;
  faqs?: { question: string; answer: string }[];
}