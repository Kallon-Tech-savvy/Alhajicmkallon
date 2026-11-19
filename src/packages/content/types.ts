export type PublicationStatus = 'draft' | 'published';

export interface Project {
  id: string;
  slug: string;
  title: string;
  role: string;
  summary: string;
  description: string;
  topics: string[];
  technologies: string[];
  status: PublicationStatus;
  publishedAt?: string;
  image?: string;
  body?: string;
  links?: {
    live?: string;
    source?: string;
  };
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  topics: string[];
  date: string;
  readTime?: string;
  excerpt: string;
  content: string;
  status: PublicationStatus;
  kind: 'journal' | 'knowledge';
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  level?: 'beginner' | 'intermediate' | 'junior';
  prerequisites?: string[];
  objectives?: string[];
  sources?: string[];
}
