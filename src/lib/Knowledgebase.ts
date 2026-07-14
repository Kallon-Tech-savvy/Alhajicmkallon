/**
 * ---------------------------------------------------------------------------
 * KNOWLEDGE BASE
 * ---------------------------------------------------------------------------
 * Single source of truth for everything the chat assistant "knows." It's
 * split into small chunks instead of one giant block of text for one
 * reason: cost and speed. On every request, retrieval.ts scores these
 * chunks against the visitor's question and only the relevant few get sent
 * to OpenAI — not the whole knowledge base. That means you can keep adding
 * pages, case studies, a resume, blog posts, etc. here indefinitely and the
 * per-message token count (and therefore cost + latency) stays roughly flat
 * instead of growing with the size of the whole site.
 *
 * HOW TO ADD MORE CONTENT (an About page, resume, blog post, testimonial,
 * anything else from the rest of the app):
 *   1. Add a new object to EXTRA_CHUNKS below (or its own array, then spread
 *      it into KNOWLEDGE_CHUNKS at the bottom).
 *   2. Give it a unique `id`, a short `title`, and a `keywords` array —
 *      plain-language words/phrases a visitor might actually type that
 *      should pull this chunk in (e.g. ['resume', 'cv', 'work history']).
 *   3. Put the actual text in `content`. Plain prose is fine.
 *   4. Leave `alwaysInclude` / `defaultInclude` unset unless it's truly
 *      core info — see the notes on those flags below.
 * No other file needs to change for new content to start working.
 * ---------------------------------------------------------------------------
 */

export interface KnowledgeChunk {
  id: string;
  title: string;
  /** Lowercase words/phrases that should cause this chunk to be retrieved. */
  keywords: string[];
  content: string;
  /** Sent on every single request regardless of topic. Reserve this for
   *  identity + contact info — the two things almost every reply needs. */
  alwaysInclude?: boolean;
  /** Sent only when nothing else scores a match — a sane generic fallback. */
  defaultInclude?: boolean;
}

export interface FaqEntry {
  id: string;
  /** Words/phrases checked against the visitor's message (case-insensitive). */
  triggerKeywords: string[];
  /** How many of the keywords above must match before this fires. */
  minMatches: number;
  answer: string;
}

// ---------------------------------------------------------------------------
// Core identity — always sent, small, and nearly every reply needs it.
// ---------------------------------------------------------------------------
export const IDENTITY_CHUNK: KnowledgeChunk = {
  id: 'identity',
  title: 'Professional Identity',
  keywords: [],
  alwaysInclude: true,
  content: `Full Name: Alhaji C. M. Kallon
Primary Professional Titles: Design Engineer | Full-Stack Software Developer | Entrepreneur | Writer
Current Base of Operations: Freetown, Sierra Leone
Global Availability: Available for remote select contracts, technical consulting, and premium UI/UX engineering worldwide.

Core Professional Focus: Alhaji operates at the intersection of rigorous engineering and high-fidelity interface design (Design Engineering). He specializes in translating complex user flows into premium, production-grade, highly performant digital interfaces. His career is dedicated to driving technological innovation, crafting scalable web architectures, and building localized and global digital solutions that deliver measurable, lasting structural impact.`,
};

export const PHILOSOPHY_CHUNK: KnowledgeChunk = {
  id: 'philosophy',
  title: 'Design Philosophy & Aesthetic DNA',
  keywords: ['philosophy', 'design philosophy', 'aesthetic', 'approach', 'principles', 'inspiration', 'style'],
  content: `Inspiration Matrix: Apple, Stripe, Linear, Vercel, Brilliance.
Aesthetic Core: Minimalist, functional, premium, and deeply cinematic dark modes.
Engineering Principles:
- Visual Polish: Heavy emphasis on fluid motion typography, intentional whitespace, and micro-interactions that communicate state changes elegantly.
- Performance First: Rigid adherence to exceptional Core Web Vitals, minimal Cumulative Layout Shift (CLS), and ultra-fast page load speeds.
- Accessibility: Ensuring beautiful design never compromises structural accessibility (WCAG compliance) or low-bandwidth performance optimization.`,
};

// ---------------------------------------------------------------------------
// Projects — split into individual chunks so asking about one project only
// pulls that project in, not all five.
// ---------------------------------------------------------------------------
export const PROJECT_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'project-aeem',
    title: 'Project: AEEM (Africa Education Empowerment Movement)',
    keywords: ['aeem', 'africa education empowerment movement', 'education platform'],
    content: `Role: Lead Design Engineer & Full-Stack Architect
Technology Stack: React, TypeScript, Vite, Supabase, Framer Motion, PostgreSQL.
Deep-Dive Technical Accomplishments:
- Engineered a custom, production-grade micro-interaction system to elevate user engagement and interface tactile feedback.
- Conducted exhaustive performance optimization passes, drastically reducing Cumulative Layout Shift (CLS) and maximizing Google Lighthouse scores.
- Architected and implemented bespoke SEO engines and AI-discoverability tooling to maximize organic platform reach.
- Designed a secure, relational PostgreSQL database schema utilizing strict Row-Level Security (RLS) policies and comprehensive automated audit logging systems.`,
  },
  {
    id: 'project-polling-hub',
    title: 'Project: Youth Innovation and Solution Polling Hub',
    keywords: ['youth innovation', 'polling hub', 'civic', 'voting', 'sierra leone platform'],
    content: `Role: Founder / Lead Developer
Location/Focus: Civic Engagement platform tailored for Sierra Leone.
Technology Stack: React, TypeScript, Vite, Supabase.
Deep-Dive Technical Accomplishments:
- Designed a scalable, highly accessible community-driven voting and civic innovation hub.
- Optimized the entire client-side bundle and asset-delivery pipeline specifically for low-bandwidth environments, ensuring seamless performance across mobile networks in Sierra Leone.
- Focused heavily on semantic HTML and keyboard navigation to maximize baseline user accessibility.`,
  },
  {
    id: 'project-crypto-award',
    title: 'Project: AI-Native Cryptographic Award System',
    keywords: ['cryptographic award', 'ai-native', 'fraud detection', 'go', 'golang project'],
    content: `Role: Systems Architect & Full-Stack Developer
Technology Stack: React, TypeScript, Vite, Supabase, Go (Golang), Artificial Intelligence Tooling.
Deep-Dive Technical Accomplishments:
- Architected a secure, immutable, and verifiable digital rewards and recognition ecosystem.
- Leveraged Go for high-performance backend processing, cryptographic verification routines, and distributed data handling.
- Integrated proprietary AI models to execute real-time fraud detection patterns and advanced automated identity/user verification.`,
  },
  {
    id: 'project-kallon-pride-fc',
    title: 'Project: Kallon Pride FC',
    keywords: ['kallon pride', 'football', 'fc', 'rebrand', 'crest', 'sports brand'],
    content: `Role: Strategic Stakeholder & Brand Architect
Identity: A prominent youth football development organization operating in Sierra Leone, focused on empowering young athletic talent.
Active Deliverables: Currently executing a comprehensive visual rebrand, including the engineering of a modern, premium crest and minimalist monogram system.`,
  },
  {
    id: 'project-portfolio',
    title: 'Project: Personal Portfolio Hub (This Website)',
    keywords: ['this website', 'portfolio site', 'this site'],
    content: `Architecture: Next.js, TypeScript, Tailwind CSS.
Design Language: Premium cinematic dark aesthetic utilizing a custom, high-contrast "pride-blue" functional accent color system.`,
  },
];

export const PROJECT_INDEX_CHUNK: KnowledgeChunk = {
  id: 'project-index',
  title: 'Project Index',
  keywords: [],
  defaultInclude: true,
  content: `Alhaji's project portfolio includes: AEEM (Africa Education Empowerment Movement), the Youth Innovation and Solution Polling Hub, an AI-Native Cryptographic Award System, Kallon Pride FC (brand work), and this Personal Portfolio Hub. Ask about any one by name for full technical detail.`,
};

// ---------------------------------------------------------------------------
// Contact — always sent. Only channels meant to be surfaced live here.
// The personal Gmail address from the old CONTEXT block is intentionally
// NOT included — no FAQ or protocol ever told the model to hand it out,
// so there was no upside to it sitting in model-readable context at all.
// ---------------------------------------------------------------------------
export const CONTACT_CHUNK: KnowledgeChunk = {
  id: 'contact',
  title: 'Contact & Communication Protocols',
  keywords: [],
  alwaysInclude: true,
  content: `Direct Professional Email: hello@alhajikallon.dev
Direct Messaging: All inquiries should be routed through the secure contact form on the Contact page. This ensures that Alhaji receives your message promptly and can respond with the appropriate level of attention and confidentiality.
Direct Phone Contact: Alhaji does not provide a public phone number. All professional inquiries should be made through the Contact page or via email.
Direct Social Media: Alhaji maintains a professional presence on LinkedIn, GitHub, and X (formerly Twitter). However, these channels are not monitored for project inquiries. Please use the Contact page for any professional communication.
On-Site Inquiries: The website features a dedicated, secure "Contact" page containing a custom inquiry form that routes communication directly to Alhaji's inbox.`,
};

// ---------------------------------------------------------------------------
// This is where "the rest of the app" goes — About page copy, a resume/CV,
// blog posts, testimonials, anything else. Paste content in following the
// same shape as the chunks above. Two placeholders shown as a template.
// ---------------------------------------------------------------------------

// export const ABOUT_PAGE_CHUNK: KnowledgeChunk = {
//   id: 'about-page',
//   title: 'About Page',
//   keywords: ['about', 'background', 'story', 'journey', 'bio'],
//   content: `<paste About page copy here>`,
// };

// export const RESUME_CHUNK: KnowledgeChunk = {
//   id: 'resume',
//   title: 'Resume / Work History',
//   keywords: ['resume', 'cv', 'work history', 'experience', 'employment', 'education background'],
//   content: `<paste resume text here>`,
// };

export const EXTRA_CHUNKS: KnowledgeChunk[] = [
  // ABOUT_PAGE_CHUNK,
  // RESUME_CHUNK,
];

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  IDENTITY_CHUNK,
  PHILOSOPHY_CHUNK,
  ...PROJECT_CHUNKS,
  PROJECT_INDEX_CHUNK,
  CONTACT_CHUNK,
  ...EXTRA_CHUNKS,
];

// ---------------------------------------------------------------------------
// Pre-approved FAQ — matched locally, in plain JS, before OpenAI is ever
// called. A hit costs $0 and returns in milliseconds. Add more the same
// way; `minMatches` is how many `triggerKeywords` must appear before it
// counts as a match — 1 is fine for a distinctive phrase, use 2 for common
// words that need company to be a confident match.
// ---------------------------------------------------------------------------
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'availability',
    triggerKeywords: ['hire', 'available', 'freelance', 'full-time', 'full time', 'contract work'],
    minMatches: 1,
    answer:
      "Alhaji is selective with his commitments but always open to discussing high-impact projects, premium design engineering contracts, or entrepreneurial ventures. Inquiries should be sent via the Contact page form or directly to hello@alhajikallon.dev.",
  },
  {
    id: 'general-coding-help',
    triggerKeywords: ['fix my code', 'write a python', 'write a script', 'debug my', 'build me an app', 'can you code'],
    minMatches: 1,
    answer:
      "As a digital concierge, I cannot generate custom code blocks or troubleshoot external projects. For project inquiries, technical consulting, or hiring Alhaji, please utilize the contact form on this site.",
  },
  {
    id: 'pricing',
    triggerKeywords: ['pricing', 'price', 'rate', 'rates', 'cost', 'how much', 'budget', 'minimum'],
    minMatches: 1,
    answer:
      "Alhaji evaluates every project individually based on scope, technical complexity, and strategic value. Specific numbers and timelines are negotiated directly during consultation. You can initiate a consultation through the Contact page.",
  },
  {
    id: 'contact-request',
    triggerKeywords: ['reach alhaji', 'get in touch', 'contact him', 'proposal', 'consulting request'],
    minMatches: 1,
    answer:
      "The most effective way to reach Alhaji is through the secure contact form on the Contact page, or by emailing hello@alhajikallon.dev.",
  },
  {
    id: 'philosophy-faq',
    triggerKeywords: ['design philosophy', 'engineering philosophy', 'what is his approach'],
    minMatches: 1,
    answer:
      "Alhaji's philosophy centers on the fusion of rigorous engineering principles with high-fidelity interface design. He prioritizes performance, accessibility, and visual polish, ensuring that every digital product he works on is not only functional but also aesthetically refined and user-centric.",
  },
  {
    id: 'past-work',
    triggerKeywords: ['past work', 'case studies', 'see examples', 'portfolio examples'],
    minMatches: 1,
    answer:
      "Yes, detailed case studies and project portfolios are available on this website — including AEEM, the Youth Innovation and Solution Polling Hub, and the AI-Native Cryptographic Award System, among others. Each case study covers his role, technology stack, and the impact of the work.",
  },
  {
    id: 'mentorship',
    triggerKeywords: ['mentorship', 'mentor', 'educational resources', 'teach me'],
    minMatches: 1,
    answer:
      "While Alhaji's primary focus is on professional projects and consulting, he occasionally engages in mentorship and knowledge-sharing initiatives. For inquiries about mentorship opportunities, please reach out via the Contact page.",
  },
];