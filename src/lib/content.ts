// NOTE: sourced from src/lib/Knowledgebase.ts — the chat assistant already
// knew about all five of these; the site itself just wasn't showing them.
// `image` and `links.live` / `links.github` are intentionally left blank —
// fill these in with real screenshots and URLs when you have them. The
// work page renders a clean placeholder instead of a broken link/image
// until then.
export const PROJECTS = [
  {
    id: 'aeem',
    title: 'AEEM',
    subtitle: 'Africa Education Empowerment Movement',
    role: 'Lead Design Engineer & Full-Stack Architect',
    timeline: '',
    tech: ['React', 'TypeScript', 'Vite', 'Supabase', 'Framer Motion', 'PostgreSQL'],
    description: 'A platform architecture for expanding access to education across Africa, built for real-world performance, not just a demo.',
    problem: 'Education platforms in the region needed to be fast, engaging, and reliable well beyond a first prototype.',
    approach: 'Engineered a custom micro-interaction system for engagement, then ran a full optimization pass targeting Core Web Vitals and Cumulative Layout Shift.',
    solution: 'Shipped bespoke SEO and AI-discoverability tooling alongside a secure PostgreSQL schema with row-level security and automated audit logging.',
    impact: [],
    image: '',
    links: { live: '', github: '', caseStudy: '#' }
  },
  {
    id: 'polling-hub',
    title: 'Youth Innovation & Solution Polling Hub',
    subtitle: 'Civic engagement, Sierra Leone',
    role: 'Founder / Lead Developer',
    timeline: '',
    tech: ['React', 'TypeScript', 'Vite', 'Supabase'],
    description: 'A civic engagement platform giving young Sierra Leoneans a direct channel to vote on and propose local innovation.',
    problem: 'Youth-led civic participation tools were scarce, and the few that existed weren\u2019t built for mobile-first, low-bandwidth reality.',
    approach: 'Designed a scalable, accessible voting and civic-innovation hub, then optimized the client bundle and asset pipeline specifically for low-bandwidth mobile networks.',
    solution: 'Prioritized semantic HTML and full keyboard navigation so the platform works across the widest possible range of visitors and connection speeds.',
    impact: [],
    image: '',
    links: { live: '', github: '', caseStudy: '#' }
  },
  {
    id: 'crypto-award',
    title: 'AI-Native Cryptographic Award System',
    subtitle: 'Verifiable digital recognition',
    role: 'Systems Architect & Full-Stack Developer',
    timeline: '',
    tech: ['React', 'TypeScript', 'Vite', 'Supabase', 'Go'],
    description: 'A verifiable digital rewards and recognition system with cryptographic integrity and AI-driven fraud detection.',
    problem: 'Digital recognition and reward systems are easy to duplicate or fake without a verifiable, tamper-evident foundation.',
    approach: 'Used Go for high-performance backend processing and cryptographic verification, keeping the trust layer separate from the application layer.',
    solution: 'Integrated AI models that flag fraud patterns in real time and automate identity verification.',
    impact: [],
    image: '',
    links: { live: '', github: '', caseStudy: '#' }
  },
  {
    id: 'kallon-pride-fc',
    title: 'Kallon Pride FC',
    subtitle: 'Brand identity',
    role: 'Strategic Stakeholder & Brand Architect',
    timeline: '',
    tech: ['Brand Identity', 'Art Direction'],
    description: 'A youth football development organization in Sierra Leone, mid-rebrand under a modern, minimalist identity system.',
    problem: 'The existing identity didn\u2019t reflect the ambitions of the athletes or the organization.',
    approach: 'Leading a full visual rebrand: crest, monogram system, and supporting identity guidelines.',
    solution: 'A premium, minimalist crest system built to travel cleanly across kits, digital, and print.',
    impact: [],
    image: '',
    links: { live: '', github: '', caseStudy: '#' }
  },
  {
    id: 'portfolio-hub',
    title: 'This Site',
    subtitle: 'Personal portfolio hub',
    role: 'Design Engineer',
    timeline: '2026',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    description: 'A cinematic, dark-mode personal platform with a custom accent system and an AI concierge built in.',
    problem: '',
    approach: '',
    solution: '',
    impact: [],
    image: '',
    links: { live: 'https://alhajicmkallon.vercel.app', github: 'https://github.com/Kallon-Tech-savvy/Alhajicmkallon', caseStudy: '#' }
  }
];

export const ARTICLES = [
  {
    slug: 'design-thinking-african-contexts',
    title: 'Design thinking in African contexts',
    category: 'Design & Strategy',
    date: 'Oct 15, 2023',
    readTime: '5 min read',
    excerpt: 'How grounded design practice can create products that are useful, human, and resilient in real-world settings.',
    content: 'Thoughtful design grows from listening closely to the people who will actually use a product.'
  }
];


