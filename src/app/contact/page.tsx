import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Code, Users, ArrowRight, Book, Video } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SUBSTACK_URL } from '@/lib/public-channels';
import { ContactForm } from '@/components/ContactForm';

const description =
  'Tell Alhaji C.M. Kallon about your idea, problem or product. No finished brief needed. Use the project enquiry form or email him directly.';

export const metadata: Metadata = {
  title: { absolute: 'Contact Alhaji C.M. Kallon | Design Engineer' },
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Alhaji C.M. Kallon',
    description,
    url: 'https://alhajikallon.com/contact',
    type: 'website',
    images: [{ url: '/assets/brand/alhaji-kallon-identity.jpg', width: 1280, height: 640 }],
  },
  twitter: {
    title: 'Contact | Alhaji C.M. Kallon',
    description,
    card: 'summary_large_image',
    images: ['/assets/brand/alhaji-kallon-identity.jpg'],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />

      <section className="page-intro site-gutter relative overflow-hidden">
        <div className="max-w-[var(--layout-max)] mx-auto relative z-10">
          <Reveal variant="up" className="max-w-3xl">
            <p className="font-display text-xs tracking-normal text-accent mb-5">Contact</p>
            <h1 className="page-title font-display tracking-[-0.03em] mb-4">
              Tell me what <span className="text-ivory/80">needs to change.</span>
            </h1>
            <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
              An early idea, a difficult process or a product that needs work: start with what you
              know. Tell me who it affects and what you want to improve; you do not need a finished
              brief or technical language.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="site-gutter" aria-labelledby="after-enquiry-heading">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <details className="rounded-lg border border-border bg-surface p-5">
            <summary
              id="after-enquiry-heading"
              className="cursor-pointer py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              What happens after I send a message?
            </summary>
            <p className="mt-3 leading-relaxed text-muted">
              I’ll read what you send and reply by email when I can. We can clarify what needs
              attention and whether I can help; scope, fees and timing would be discussed before any
              work is agreed.
            </p>
          </details>
        </div>
      </section>
      <section className="section-space site-gutter">
        <div className="max-w-[var(--layout-max)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
          {/* The primary enquiry form comes first in the reading and tab order. */}
          <ContactForm />

          {/* Other ways to contact me */}
          <Reveal variant="up" delay={60} className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-display text-accent text-xs font-semibold tracking-normal mb-6">
                Email me directly
              </h2>
              <div className="p-6 glass-frost-light rounded-xl flex items-center gap-4 group">
                <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-midnight transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-display font-medium text-muted mb-1">
                    New projects and general enquiries
                  </div>
                  <a
                    href="mailto:info@alhajikallon.com"
                    className="text-lg font-display font-bold hover:text-accent transition-colors duration-300 underline-grow"
                  >
                    info@alhajikallon.com
                  </a>
                  <div className="mt-4 text-xs font-display font-medium text-muted mb-1">
                    Technical and development questions
                  </div>
                  <a
                    href="mailto:dev@alhajikallon.com"
                    className="text-lg font-display font-bold hover:text-accent transition-colors duration-300 underline-grow"
                  >
                    dev@alhajikallon.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-xs font-semibold text-accent">
                Other places to find my work
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    name: 'LinkedIn',
                    icon: <Users size={18} />,
                    href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b',
                    desc: 'Professional background and updates',
                  },
                  {
                    name: 'GitHub',
                    icon: <Code size={18} />,
                    href: 'https://github.com/Kallon-Tech-savvy',
                    desc: 'Code, experiments and project work',
                  },
                  {
                    name: 'Substack',
                    icon: <Book size={18} />,
                    href: SUBSTACK_URL,
                    desc: 'Writing on technology and society',
                  },
                  {
                    name: 'TikTok',
                    icon: <Video size={18} />,
                    href: 'https://tiktok.com/Zs9jMKdFNCeJ7-ypwTZ',
                    desc: 'Short videos and updates',
                  },
                  {
                    name: 'Facebook',
                    icon: <Users size={18} />,
                    href: 'https://www.facebook.com/profile.php?id=100072626448471',
                    desc: 'Community updates',
                  },
                ].map((social, i) => (
                  <Reveal key={social.name} variant="up" delay={i * 50}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 glass-frost-light hover:border-accent/20 transition-colors duration-300 rounded-xl group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-muted group-hover:text-accent transition-colors duration-300">
                          {social.icon}
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-ivory group-hover:text-accent transition-colors duration-300">
                            {social.name}
                          </div>
                          <div className="text-xs text-muted tracking-wide mt-0.5">
                            {social.desc}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                      />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer showInvitation={false} />
    </main>
  );
}
