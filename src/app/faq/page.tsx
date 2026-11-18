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
    images: [{ url: '/assets/brand/alhaji-kallon-identity.jpg', width: 1280, height: 640 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions | Alhaji C.M. Kallon',
    description: 'Answers about Alhaji C.M. Kallon’s design engineering services, process, experience and how to work with him.',
    images: ['/assets/brand/alhaji-kallon-identity.jpg'],
  },
};

const faqs = [
  {
    category: 'About Alhaji C.M. Kallon',
    items: [
      {
        question: 'Who is Alhaji C.M. Kallon?',
        answer:
          "Alhaji C.M. Kallon is a Sierra Leonean design engineer based in Freetown. He helps founders, businesses and organisations turn unclear ideas into digital products people can use, working from the first question about the problem through to a working product.",
      },
      {
        question: 'What does Alhaji Kallon do?',
        answer:
          "Alhaji Kallon helps people decide what to build, why it matters and how to turn that decision into a working product. His work connects understanding the problem, defining a product, designing the experience and engineering a reliable, accessible and fast solution.",
      },
      {
        question: 'What is a design engineer?',
        answer:
          "A design engineer works on both sides of a product: how it should look and feel, and how it is built. In Alhaji’s work, that means connecting product requirements to clear interfaces and maintainable code without losing the reasoning between design and implementation.",
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
          "Alhaji works with startup founders, business owners, nonprofits and community organisations. He is most useful when there is an early-stage idea, an unclear business problem or an existing product that needs clearer direction.",
      },
      {
        question: 'Can Alhaji Kallon help turn a business idea into a digital product?',
        answer:
          "Yes. He can clarify the problem, identify who the product is for, decide which features are essential, design the experience and build a first working version. The decisions are guided by the project’s goals, available evidence and resources.",
      },
      {
        question: 'Does Alhaji Kallon only develop websites?',
        answer:
          "No. Web development is part of his work, but he also helps with what comes before it: the problem, how information is structured, the user journey and the features that matter. That thinking often comes before any design or code.",
      },
      {
        question: 'What technologies does Alhaji Kallon use?',
        answer:
          "On the front end he uses React, TypeScript, Next.js and Vite. On the back end and infrastructure he uses Supabase, Express and Cloudflare Workers. Tool choices depend on what the product needs and what it will cost to maintain.",
      },
    ],
  },
  {
    category: 'Process and philosophy',
    items: [
      {
        question: 'What is Alhaji Kallon’s product development process?',
        answer:
          "Alhaji works in four connected stages: Discover — understand the problem, people and context; Define — decide what to build and why; Design — shape information, journeys and interfaces; Build — engineer and deliver a working product. These stages overlap; learning while building can send the work back to an earlier decision.",
      },
      {
        question: 'What is Alhaji Kallon’s approach to building digital products?',
        answer:
          "He believes a product earns its place by solving a problem people care about and showing that it does. He starts by asking who the product is for, what those people are trying to do and what the first version needs to prove. He separates facts from assumptions, weighs trade-offs and prefers focused learning to features without a clear purpose.",
      },
      {
        question: 'What makes Alhaji Kallon’s approach different?',
        answer:
          "He connects product decisions, design and engineering in one practice. On the AEEM project, that meant starting with how visitors understood the organisation before deciding how the website should be structured.",
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
          "His selected work includes AEEM, a digital presence for the Africa Education Empowerment Movement, covering content structure, experience design and development; and MJ Studio, an in-progress photography-studio backend built with TypeScript, Express and Supabase. MJ Studio is not presented as a finished launch.",
        links: [
          { label: 'Read the AEEM case study', href: '/work/aeem-digital-presence' },
          { label: 'Read the MJ Studio notes', href: '/work/mj-studio-backend' },
          { label: 'Visit the live AEEM website', href: 'https://aeem-w.vercel.app' },
        ],
      },
      {
        question: 'What was Alhaji Kallon’s role in the AEEM website project?',
        answer:
          "He initiated the AEEM website as a volunteer, organised information about its mission and activities, improved access to resources and made participation routes easier to find. He later served as AEEM’s Chief Operating Officer. The core team reviewed the website positively, but wider visitor outcomes have not been measured.",
      },
    ],
  },
  {
    category: 'Availability and contact',
    items: [
      {
        question: 'Do I need a finished brief or technical knowledge to get started?',
        answer: 'No. You do not need a finished brief or technical knowledge to start a conversation. Tell Alhaji what you are trying to achieve and what you know so far so the problem and next step can be clarified.',
      },
      {
        question: 'How much does a project cost?',
        answer: 'No fixed prices are published. Alhaji discusses the problem, likely scope and constraints before agreeing on project pricing. Send a short description through the contact page to start.',
      },
      {
        question: 'Is Alhaji Kallon available for projects?',
        answer:
          'Alhaji Kallon is open to thoughtful projects involving product discovery, experience design and software engineering. Project suitability depends on the problem, objectives, scope and available resources.',
      },
      {
        question: 'How can I work with Alhaji Kallon?',
        answer:
          "Start with the contact page. Tell him what you are trying to achieve, who the product is for and where you need help. You do not need a finished brief.",
        links: [{ label: 'Contact Alhaji', href: '/contact' }],
      },
      {
        question: 'How can I contact Alhaji Kallon?',
        answer:
          "For project and general enquiries, use the contact page or email info@alhajikallon.com. For technical or development questions, email dev@alhajikallon.com. You can also find him on LinkedIn and GitHub.",
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

      <section className="page-intro site-gutter">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <p className="mb-6 font-display text-xs uppercase tracking-[0.16em] text-accent">
            About my work · Answers to common questions
          </p>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="page-title font-display tracking-tight">
                Frequently asked{' '}
                <span className="block text-accent">questions.</span>
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted lg:col-span-4">
              Clear answers about who I am, the problems I help solve, how I
              approach product work, and what it is like to work with me.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space site-gutter pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 border-y border-border py-5">
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
                <span className="font-display text-xs text-accent">
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
                <h2
                  id={`faq-group-${groupIndex}`}
                  className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ivory"
                >
                  {group.category}
                </h2>
                <span className="h-px flex-1 bg-navy" />
              </div>

              <div className="divide-y divide-white/10 border-y border-border">
                {group.items.map((item, itemIndex) => (
                  <details
                    key={item.question}
                    className="group py-5"
                    open={groupIndex === 0 && itemIndex === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left marker:hidden">
                      <h3 className="text-base font-medium leading-relaxed text-ivory transition-colors group-hover:text-accent md:text-lg">
                        {item.question}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-border font-display text-sm text-accent transition-transform group-open:rotate-45"
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
                              className="text-sm font-medium text-accent underline decoration-pride-blue/40 underline-offset-4 hover:decoration-pride-blue"
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

          <div className="mt-16 border border-border bg-surface p-7 md:p-10">
            <p className="mb-3 font-display text-xs uppercase tracking-[0.16em] text-accent">
              Have a project in mind?
            </p>
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
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
            Explore <Link href="/about" className="text-accent underline underline-offset-4">more about my background</Link>,{' '}
            <Link href="/work" className="text-accent underline underline-offset-4">selected work</Link> and{' '}
            <Link href="/writing" className="text-accent underline underline-offset-4">writing</Link>.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Footer showInvitation={false} />
    </main>
  );
}
