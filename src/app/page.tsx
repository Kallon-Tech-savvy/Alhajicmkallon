import { Arrow, Asterisk } from '@/components/SwissMarks';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedWork } from '@/components/FeaturedWork';
import { Footer } from '@/components/Footer';

const PRACTICE = [
  {
    title: 'Find the real problem.',
    description: 'Talk to people, learn the constraints, and agree what success looks like.',
  },
  {
    title: 'Make the experience clear.',
    description: 'Shape the structure, words and design so people know what to do next.',
  },
  {
    title: 'Build it to last.',
    description: 'Engineer carefully, test, and check that it works in the conditions people use it in.',
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
            <p className="swiss-meta">02 / The way I work</p>
            <span className="perspective-star" aria-hidden="true">
              <Asterisk />
            </span>
          </div>
          <div className="perspective-grid">
            <h2 id="perspective-heading">
              Big on clarity.
              <br />
              Grounded in
              <br />
              <span>real life.</span>
            </h2>
            <div className="perspective-copy">
              <p>
                Good products start with understanding people: their goals, their constraints, and
                the world they live in.
              </p>
              <p>
                My perspective is shaped by life in Sierra Leone and by my work with AEEM,
                where I initiated the website and later served as Chief Operating Officer.
              </p>
              <p>The balance I aim for: think clearly, design simply, build carefully.</p>
              <Link prefetch={false} href="/about" className="swiss-text-link">
                Meet the person behind the work <Arrow />
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
                </div>
                <span aria-hidden="true">
                  <Arrow />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="swiss-explore site-gutter" aria-labelledby="explore-heading">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <div className="swiss-section-heading">
            <div>
              <p className="swiss-meta section-index">03 / Keep learning with me</p>
              <h2 id="explore-heading">
                Made to be
                <br />
                shared.
              </h2>
            </div>
            <p className="max-w-sm text-muted">
              Notes, experiments and practical guides from what I’m learning along the way.
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
                <h3>Notes from the work.</h3>
                <p>Design, technology and the decisions in between.</p>
              </div>
              <span className="explore-card-link">
                Read the writing <Arrow />
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
                <h3>Pass the knowledge on.</h3>
                <p>Practical guides and a free 12-part course on how software systems talk to each other: HTTP, APIs, identity, events and debugging.</p>
              </div>
              <span className="explore-card-link">
                Start learning <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
