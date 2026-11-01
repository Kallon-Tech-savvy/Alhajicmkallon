import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const siteUrl = 'https://alhajikallon.com';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Learn about Alhaji C.M. Kallon, a Sierra Leonean design engineer: his services, product development process, experience, technologies and how to work with him.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | Alhaji C.M. Kallon',
    description:
      'Answers about Alhaji C.M. Kallon, his design engineering practice, services, projects and approach to building digital products.',
    url: `${siteUrl}/faq`,
    type: 'website',
  },
};

const faqs = [
  {
    category: 'About Alhaji C.M. Kallon',
    items: [
      {
        question: 'Who is Alhaji C.M. Kallon?',
        answer:
          'Alhaji C.M. Kallon is a Sierra Leonean design engineer based in Freetown. He helps founders, businesses and organisations turn unclear ideas into useful digital products. His work brings together problem discovery, product thinking, experience design and software engineering.',
      },
      {
        question: 'What does Alhaji Kallon do?',
        answer:
          'Alhaji Kallon helps people understand what they need to build, why it matters, and how to turn that decision into a working digital product. He works across the process: understanding the problem, defining the product, designing its experience, and engineering a reliable, accessible and performant solution.',
      },
      {
        question: 'What is a design engineer?',
        answer:
          'A design engineer works across design and engineering, connecting how a product should work and feel with how it is actually built. In Alhaji Kallon’s work, this means translating product requirements and user needs into clear interfaces, thoughtful interactions and maintainable software.',
      },
      {
        question: 'Where is Alhaji Kallon based?',
        answer:
          'Alhaji C.M. Kallon is based in Freetown, Sierra Leone. He works on digital products with founders, businesses, teams and organisations from there.',
      },
    ],
  },
  {
    category: 'Services and expertise',
    items: [
      {
        question: 'What services does Alhaji Kallon offer?',
        answer:
          'Alhaji Kallon offers four connected areas of work: problem discovery, product thinking, experience design and engineering. Problem discovery examines users, context and current workarounds. Product thinking clarifies the value proposition, risky assumptions and useful first version. Experience design shapes information, journeys and interfaces. Engineering builds and improves products with attention to usability, performance, accessibility, reliability and security.',
      },
      {
        question: 'Who does Alhaji Kallon work with?',
        answer:
          'He works with startup founders, business owners, nonprofits and community organisations. He is particularly interested in working with people who have an early-stage idea, an unclear business problem, or an existing digital product that needs a more considered direction.',
      },
      {
        question: 'Can Alhaji Kallon help turn a business idea into a digital product?',
        answer:
          'Yes. He can help clarify the underlying problem, identify the people the product should serve, shape its value proposition, decide which features are essential, design the experience and build the first working version. The process is guided by the project’s objectives, evidence, available resources and constraints.',
      },
      {
        question: 'Does Alhaji Kallon only develop websites?',
        answer:
          'No. Although web development is an important part of his engineering work, his approach extends beyond implementing website designs. He considers the underlying problem, information structure, user journeys, essential features and the practical requirements of delivering a useful digital product.',
      },
      {
        question: 'What technologies does Alhaji Kallon use?',
        answer:
          'His web development work includes React, TypeScript, Next.js and Vite. His backend and infrastructure experience includes Supabase and Cloudflare Workers. Technology choices depend on the product’s requirements, complexity, resources and long-term needs.',
      },
    ],
  },
  {
    category: 'Process and philosophy',
    items: [
      {
        question: 'What is Alhaji Kallon’s product development process?',
        answer:
          'His process has four connected stages: Discover (understand the problem, people and context), Define (clarify the problem, value proposition and what to build), Design (shape information, user journeys, interfaces and interactions), and Build (engineer and deliver a working product). The process is iterative, and learning during design or development can lead to revisiting earlier decisions.',
      },
      {
        question: 'What is Alhaji Kallon’s approach to building digital products?',
        answer:
          'He believes a product earns its place by solving a problem people care about and demonstrating that it does. His approach starts with questions about who the product serves, what those people are trying to accomplish, what evidence supports the opportunity and what the first version must prove. He distinguishes facts from assumptions, considers trade-offs and favours focused learning over building features without a clear purpose.',
      },
      {
        question: 'What makes Alhaji Kallon’s approach different?',
        answer:
          'His work connects product decisions with design and engineering. Rather than treating development as simply implementing a list of requested features, he considers the underlying problem, the people affected, the value a solution should create and the practical constraints involved in delivering it.',
      },
    ],
  },
  {
    category: 'Background and experience',
    items: [
      {
        question: 'What is Alhaji Kallon’s educational background?',
        answer:
          'Alhaji Kallon began studying Computer Science at Central University Sierra Leone in 2022. From 2024, he continued developing his knowledge independently through focused study and practical work, applying software engineering, product thinking and design principles to real projects.',
      },
      {
        question: 'What projects has Alhaji Kallon worked on?',
        answer:
          'His selected work includes a digital presence project for the Africa Education Empowerment Movement (AEEM), where he worked across content architecture, user experience and frontend development. He is also developing the backend foundation for MJ Studio, a photography-studio application, using TypeScript, Express and Supabase. MJ Studio is an in-progress project, not a completed launch.',
        links: [
          { label: 'Read the AEEM case study', href: '/work/aeem-digital-presence' },
          { label: 'Read about MJ Studio', href: '/work/mj-studio-backend' },
          { label: 'Visit the live AEEM website', href: 'https://aeem-w.vercel.app' },
        ],
      },
      {
        question: 'What was Alhaji Kallon’s role in the AEEM website project?',
        answer:
          'He worked on improving how AEEM communicates its work and how visitors understand and engage with the organisation. This included organising information about its mission and activities, improving access to resources, and making opportunities to volunteer, partner and support the organisation easier to discover.',
      },
    ],
  },
  {
    category: 'Availability and contact',
    items: [
      {
        question: 'Is Alhaji Kallon available for projects?',
        answer:
          'Alhaji Kallon is open to thoughtful projects involving product discovery, experience design and software engineering. Project suitability depends on the problem, objectives, scope and available resources.',
      },
      {
        question: 'How can I work with Alhaji Kallon?',
        answer:
          'Start by exploring his portfolio and relevant case studies. If you have a project, idea or problem to discuss, use the contact page to explain what you are trying to achieve, who the product is for and where you need help.',
        links: [{ label: 'Contact Alhaji', href: '/contact' }],
      },
      {
        question: 'How can I contact Alhaji Kallon?',
        answer:
          'You can reach Alhaji Kallon through the contact page or connect with him through LinkedIn and GitHub.',
        links: [
          { label: 'Contact page', href: '/contact' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b' },
          { label: 'GitHub', href: 'https://github.com/Kallon-Tech-savvy' },
        ],
      },
    ],
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/faq#faq`,
  url: `${siteUrl}/faq`,
  name: 'Frequently Asked Questions about Alhaji C.M. Kallon',
  about: { '@id': `${siteUrl}/#person` },
  mainEntity: faqs.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  ),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-midnight text-ivory">
      <Navbar />

      <section className="px-6 pb-16 pt-36 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 font-space text-xs uppercase tracking-[0.35em] text-gold">
            About my work · Answers to common questions
          </p>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="font-space text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Frequently asked
                <span className="block text-pride-blue">questions.</span>
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted lg:col-span-4">
              Clear answers about who I am, the problems I help solve, how I
              approach product work, and what it is like to work with me.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 border-y border-white/10 py-5">
            <p className="max-w-3xl text-sm leading-relaxed text-muted">
              I’m Alhaji C.M. Kallon, a design engineer based in Freetown,
              Sierra Leone. I help founders, businesses and organisations turn
              unclear ideas into useful digital products through discovery,
              product thinking, experience design and engineering.
            </p>
          </div>

          {faqs.map((group, groupIndex) => (
            <section
              key={group.category}
              aria-labelledby={`faq-group-${groupIndex}`}
              className="mb-14"
            >
              <div className="mb-5 flex items-center gap-4">
                <span className="font-space text-xs text-gold">
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
                <h2
                  id={`faq-group-${groupIndex}`}
                  className="font-space text-sm font-bold uppercase tracking-[0.2em] text-ivory"
                >
                  {group.category}
                </h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {group.items.map((item, itemIndex) => (
                  <details
                    key={item.question}
                    className="group py-5"
                    open={groupIndex === 0 && itemIndex === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left marker:hidden">
                      <h3 className="text-base font-medium leading-relaxed text-ivory transition-colors group-hover:text-pride-blue md:text-lg">
                        {item.question}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-white/15 font-space text-sm text-gold transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="max-w-3xl pb-2 pt-4 pr-10 text-sm leading-7 text-muted md:text-base">
                      <p>{item.answer}</p>
                      {'links' in item && item.links && (
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                          {item.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-sm font-medium text-pride-blue underline decoration-pride-blue/40 underline-offset-4 hover:decoration-pride-blue"
                              target={link.href.startsWith('http') ? '_blank' : undefined}
                              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-16 border border-white/10 bg-white/[0.02] p-7 md:p-10">
            <p className="mb-3 font-space text-xs uppercase tracking-[0.3em] text-gold">
              Have a project in mind?
            </p>
            <h2 className="mb-4 font-space text-2xl font-bold tracking-tight md:text-3xl">
              Start with the problem.
            </h2>
            <p className="mb-7 max-w-2xl text-sm leading-relaxed text-muted">
              You do not need a finished brief. Tell me what you are trying to
              achieve, what you know so far and where you need help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center border border-pride-blue/50 bg-pride-blue/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-pride-blue/20"
            >
              Discuss a project <span aria-hidden="true" className="ml-3">↗</span>
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted">
            Explore <Link href="/about" className="text-pride-blue underline underline-offset-4">more about my background</Link>,{' '}
            <Link href="/work" className="text-pride-blue underline underline-offset-4">selected work</Link> and{' '}
            <Link href="/writing" className="text-pride-blue underline underline-offset-4">writing</Link>.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Footer />
    </main>
  );
}
