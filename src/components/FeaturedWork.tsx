import { Arrow } from './SwissMarks';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/packages/content/server';

export const FeaturedWork = () => {
  const aeem = PROJECTS.find((project) => project.slug === 'aeem-digital-presence');
  const others = PROJECTS.filter((project) => project.slug !== 'aeem-digital-presence');

  return (
    <section id="work" className="swiss-work site-gutter" aria-labelledby="work-heading">
      <div className="mx-auto max-w-[var(--layout-max)]">
        <div className="swiss-section-heading">
          <div>
            <p className="swiss-meta section-index">01 / Selected work</p>
            <h2 id="work-heading">
              Thinking made
              <br />
              <span className="text-accent">tangible.</span>
            </h2>
          </div>
          <Link prefetch={false} href="/work" className="swiss-text-link">
            All projects{' '}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>

        {aeem && (
          <article className="work-feature">
            <Link
              prefetch={false}
              href={`/work/${aeem.slug}`}
              className="work-canvas"
              aria-label="Explore the AEEM case study"
            >
              <div className="work-canvas-top" aria-hidden="true">
                <span>AEEM / EDUCATION & COMMUNITY</span>
                <span>01 — WORKING WEBSITE</span>
              </div>
              <div className="work-browser">
                <div className="work-browser-chrome" aria-hidden="true">
                  <span>● ● ●</span>
                  <span>aeem-w.vercel.app</span>
                  <span>
                    <Arrow />
                  </span>
                </div>
                <Image
                  src="/assets/aeem-live-home.webp"
                  alt="The working AEEM homepage: its education mission, navigation and paths to impact and participation"
                  width={1356}
                  height={931}
                  sizes="(max-width: 768px) 90vw, 950px"
                  className="h-auto w-full"
                />
              </div>
              <span className="work-open" aria-hidden="true">
                <Arrow />
              </span>
            </Link>
            <div className="work-caption">
              <div>
                <p className="swiss-meta text-accent">AEEM</p>
                <p className="mt-2 text-sm text-muted">Product thinking / UX / Development</p>
              </div>
              <div>
                <h3>
                  <Link prefetch={false} href={`/work/${aeem.slug}`}>
                    Good work deserves
                    <br />a clearer way in.
                  </Link>
                </h3>
                <p className="mt-4 text-muted">
                  Bringing an education organisation’s mission, activities and opportunities to
                  participate into one place.
                </p>
              </div>
              <div className="work-links">
                <Link prefetch={false} href={`/work/${aeem.slug}`} className="swiss-text-link">
                  Explore the case study <Arrow />
                </Link>
                {aeem.links?.live && (
                  <a
                    href={aeem.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-secondary-link"
                  >
                    Visit the working website <Arrow />
                  </a>
                )}
              </div>
            </div>
          </article>
        )}

        {others.map((project) => (
          <article key={project.slug} className="work-row">
            <div>
              <p className="swiss-meta text-muted">02 / In development</p>
              <span className="work-status">Development notes</span>
            </div>
            <div>
              <h3>
                <Link prefetch={false} href={`/work/${project.slug}`}>
                  {project.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl text-muted">{project.summary}</p>
            </div>
            <Link
              prefetch={false}
              href={`/work/${project.slug}`}
              className="work-row-arrow"
              aria-label={`Read the development notes for ${project.title}`}
            >
              <Arrow />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
