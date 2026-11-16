import { Arrow, Asterisk } from '@/components/SwissMarks';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedWork } from '@/components/FeaturedWork';
import { Footer } from '@/components/Footer';

const PRACTICE = ['Find the real problem.', 'Make the experience clear.', 'Build it to work.'];

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
          <span>Frontend engineering</span>
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
                Good products start with understanding people. Their goals, their constraints, and
                the world they live in.
              </p>
              <p>
                My perspective is shaped by life in Sierra Leone and work with organisations like
                AEEM. I bring curiosity to the problem and care to the details, from the first
                question to the working product.
              </p>
              <Link prefetch={false} href="/about" className="swiss-text-link">
                Meet the person behind the work <Arrow />
              </Link>
            </div>
          </div>
          <ol className="practice-steps">
            {PRACTICE.map((step, index) => (
              <li key={step}>
                <span className="swiss-meta">0{index + 1}</span>
                <h3>{step}</h3>
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
              <p className="swiss-meta section-index">03 / Keep the curiosity going</p>
              <h2 id="explore-heading">
                Made to be
                <br />
                shared.
              </h2>
            </div>
            <p className="max-w-sm text-muted">
              Notes, experiments and practical guides. A little of what I’m learning along the way.
            </p>
          </div>
          <div className="explore-grid">
            <Link prefetch={false} href="/writing" className="explore-card">
              <span className="swiss-meta">Writing / Ideas & reflections</span>
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
              <span className="swiss-meta">Knowledge / Learn by building</span>
              <span className="explore-symbol" aria-hidden="true">
                &#123; &#125;
                <span>
                  <Arrow />
                </span>
              </span>
              <div>
                <h3>Pass the knowledge on.</h3>
                <p>Practical guides and a free, 12-part protocol course.</p>
              </div>
              <span className="explore-card-link">
                Find your next step <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
