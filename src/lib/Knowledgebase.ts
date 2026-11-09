/** Curated from the published About, Work, Contact and learning pages. */
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


export const IDENTITY_CHUNK: KnowledgeChunk = {
  id: 'identity', title: 'Alhaji C.M. Kallon', keywords: [], alwaysInclude: true,
  content: 'Alhaji C.M. Kallon is a design engineer based in Freetown, Sierra Leone. His work connects problem discovery, product thinking, experience design and software engineering. He helps organisations turn unclear ideas into useful digital products. Availability, rates and delivery timelines must be confirmed directly.',
};
export const PHILOSOPHY_CHUNK: KnowledgeChunk = {
  id: 'philosophy', title: 'Approach and principles', keywords: ['approach', 'design', 'philosophy', 'principles', 'style'],
  content: 'Understand the problem, decide what is worth building, design the experience and develop it. Principles: evidence before claims, clarity before scope, useful over impressive, people in context, visible reasoning and continued learning. This website combines Swiss typographic hierarchy and grids with Japanese minimalism, warm paper or charcoal surfaces and a restrained blue accent.',
};
export const PROJECT_CHUNKS: KnowledgeChunk[] = [
  { id: 'project-aeem', title: 'AEEM: working website', keywords: ['aeem', 'education', 'organisation', 'volunteer', 'report'], content: 'AEEM is a youth-led education organisation. Its reports were scattered across social channels, making activities difficult to verify and participation unclear. Alhaji initiated the website, organised the About experience and involvement journeys, and converted existing reports into accessible programme pages. He later volunteered as Chief Operating Officer. The working website is aeem-w.vercel.app. The core team tested pages and navigation. The documented I am Somebody Initiative involved 42 participants and six schools in Freetown on 29 January 2025; these are programme figures, not website conversions. No measured conversion, traffic or engagement improvement is established. The published case study is /work/aeem-digital-presence.' },
  { id: 'project-mj-studio', title: 'MJ Studio: in development', keywords: ['mj studio', 'photography', 'photographer', 'backend', 'permissions'], content: 'MJ Studio is a photography studio product in development. The published backend notes describe a structured domain model, studio-aware permissions, transactional data operations and automated API and migration checks. It is not presented as a validated commercial success. Read /work/mj-studio-backend for implementation detail and limitations.' },
  { id: 'project-portfolio', title: 'This website', keywords: ['this website', 'this site', 'portfolio', 'stack'], content: 'This website uses Next.js, React, TypeScript and Tailwind CSS, with server-rendered portfolio content and on-demand search/chat interfaces. Public Work distinguishes the working AEEM website from MJ Studio development notes. Writing links to Alhaji’s Substack publication at alhajicmkallon.substack.com. The learning hub has paths for newcomers, intermediate developers and working juniors. Theme options are Light, Dark and System.' },
];
export const PROJECT_INDEX_CHUNK: KnowledgeChunk = {
  id: 'project-index', title: 'Published work', keywords: [], defaultInclude: true,
  content: 'The published Work page contains the AEEM working website case study and MJ Studio backend development notes. Start at /work. Do not infer other completed projects, testimonials or business outcomes.',
};
export const CONTACT_CHUNK: KnowledgeChunk = {
  id: 'contact', title: 'Contact', keywords: [], alwaysInclude: true,
  content: 'Use the contact form at /contact. General enquiries: info@alhajikallon.com. Development enquiries: dev@alhajikallon.com. No public phone or WhatsApp number. The assistant cannot submit forms, send messages, book meetings or promise a response time.',
};
export const EXTRA_CHUNKS: KnowledgeChunk[] = [];
export const KNOWLEDGE_CHUNKS = [IDENTITY_CHUNK, PHILOSOPHY_CHUNK, ...PROJECT_CHUNKS, PROJECT_INDEX_CHUNK, CONTACT_CHUNK, ...EXTRA_CHUNKS];
export const FAQ_ENTRIES: FaqEntry[] = [
  { id: 'availability', triggerKeywords: ['hire', 'available', 'freelance', 'contract work'], minMatches: 1, answer: 'To discuss a project or confirm availability, use the Contact page. Share the problem, intended users and any timing constraints. General enquiries go to info@alhajikallon.com; development enquiries go to dev@alhajikallon.com.' },
  { id: 'pricing', triggerKeywords: ['pricing', 'hourly rate', 'how much', 'project cost'], minMatches: 1, answer: 'No fixed prices are published here. Contact Alhaji with your project context so he can discuss scope, timing and cost directly.' },
  { id: 'contact-request', triggerKeywords: ['reach alhaji', 'get in touch', 'contact him', 'email address'], minMatches: 1, answer: 'Use the Contact page form, or email info@alhajikallon.com for general enquiries and dev@alhajikallon.com for development enquiries. This assistant cannot send an enquiry on your behalf.' },
  { id: 'philosophy-faq', triggerKeywords: ['design philosophy', 'engineering philosophy', 'what is his approach'], minMatches: 1, answer: 'Alhaji starts by understanding the problem and the people affected, then decides what is worth building before designing and developing it. His principles include clarity, useful outcomes and evidence before claims. The AEEM case study shows that reasoning in practice.' },
  { id: 'past-work', triggerKeywords: ['past work', 'case studies', 'see examples', 'portfolio examples'], minMatches: 1, answer: 'Start with the Work page: AEEM is a working education organisation website, with a case study covering the problem, decisions and evidence limitations. MJ Studio has backend development notes and is labelled in development. Programme participation figures are not website conversion results.' },
  { id: 'learning', triggerKeywords: ['learning resources', 'teach me', 'learning hub', 'mentorship'], minMatches: 1, answer: 'The learning hub offers paths for newcomers, intermediate developers and working juniors. Explore the Learn menu for guides on foundations, APIs, TypeScript and delivery. Personal mentorship availability is not confirmed here; ask Alhaji through Contact.' },
];
