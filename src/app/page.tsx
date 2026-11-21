import { Arrow, Asterisk } from '@/components/SwissMarks';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedWork } from '@/components/FeaturedWork';
import { Footer } from '@/components/Footer';

const PRACTICE = [
  {
    title: 'Understand what needs to change.',
    disclosure: 'How we examine the problem',
    description:
      'Start with the people affected, the task they need to complete and what is getting in their way.',
    detail:
      'We examine the current process, what is known and what still needs checking. The aim is to agree which problem deserves attention and how we will recognise improvement.',
  },
  {
    title: 'Make the next action clear.',
    disclosure: 'How we check the experience',
    description: 'Give people the information they need to choose, act and understand the result.',
    detail:
      'We work through the journey, labels, content and interface before adding detail. Early designs help us check whether people can complete the task and recover when something goes wrong.',
  },
  {
    title: 'Build, check and improve.',
    disclosure: 'What we check before and after release',
    description:
      'Turn the agreed approach into working software and check it against the task it needs to support.',
    detail:
      'We consider access, data, errors, performance and the conditions people use the product in. What we observe after release informs what to improve next.',
  },
];

export default function Home() {
  return (
    <main className="editorial-page min-h-screen">
      <Navbar />
      <Hero />
      <div className="discipline-strip site-gutter" aria-label="My disciplines">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <span>Product thinking</span>
          <span aria-hidden="true">
            <Asterisk />
          </span>
          <span>Experience design</span>
          <span aria-hidden="true">
            <Asterisk />
          </span>
          <span>Web engineering</span>
          <span aria-hidden="true">
            <Arrow />
          </span>
        </div>
      </div>
      <FeaturedWork />

      <section className="swiss-perspective site-gutter" aria-labelledby="perspective-heading">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <div className="perspective-heading">
            <p className="swiss-meta">How I work</p>
            <span className="perspective-star" aria-hidden="true">
              <Asterisk />
            </span>
          </div>
          <div className="perspective-grid">
            <h2 id="perspective-heading">
              People first.
              <br />
              Decisions with
              <br />
              <span>a reason.</span>
            </h2>
            <div className="perspective-copy">
              <p>
                Before choosing a screen or a technology, I want to understand the task someone
                needs to complete and the conditions they are working in.
              </p>
              <p>
                My perspective is shaped by life in Sierra Leone and by my work with AEEM, where I
                initiated the website and later served as Chief Operating Officer.
              </p>
              <p>The balance I aim for: think clearly, design simply, build carefully.</p>
              <Link prefetch={false} href="/about" className="swiss-text-link">
                Read about my background and approach <Arrow />
              </Link>
            </div>
          </div>
          <ol className="practice-steps">
            {PRACTICE.map((step, index) => (
              <li key={step.title}>
                <span className="swiss-meta">0{index + 1}</span>
                <div className="practice-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <details className="mt-4 max-w-2xl">
                    <summary className="cursor-pointer py-2 text-sm font-semibold text-[var(--brand-paper)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                      {step.disclosure}
                    </summary>
                    <p className="mt-3">{step.detail}</p>
                  </details>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="swiss-explore site-gutter" aria-labelledby="explore-heading">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <div className="swiss-section-heading">
            <div>
              <p className="swiss-meta section-index">Writing and learning</p>
              <h2 id="explore-heading">
                Here to read
                <br />
                or learn?
              </h2>
            </div>
            <p className="max-w-sm text-muted">
              Choose an essay to reflect on, a guide to practise with, or a glossary to look up an
              unfamiliar term.
            </p>
          </div>
          <div className="explore-grid">
            <Link prefetch={false} href="/writing" className="explore-card">
              <span className="swiss-meta">Writing / Notes & essays</span>
              <span className="explore-symbol" aria-hidden="true">
                Aa
                <span>
                  <Arrow />
                </span>
              </span>
              <div>
                <h3>Essays and reflections.</h3>
                <p>
                  Personal reflections on identity, ambition and meaning, alongside writing on
                  technology and society.
                </p>
              </div>
              <span className="explore-card-link">
                Browse essays <Arrow />
              </span>
            </Link>
            <Link prefetch={false} href="/knowledge" className="explore-card explore-card-blue">
              <span className="swiss-meta">Learn / Learn by building</span>
              <span className="explore-symbol" aria-hidden="true">
                &#123; &#125;
                <span>
                  <Arrow />
                </span>
              </span>
              <div>
                <h3>Practise a skill. Understand a term.</h3>
                <p>
                  Short development guides, a glossary of design engineering, AI and API terms, and
                  a free 12-part software protocol course.
                </p>
              </div>
              <span className="explore-card-link">
                Choose a guide or look up a term <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
