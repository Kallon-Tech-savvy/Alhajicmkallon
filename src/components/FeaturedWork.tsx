import { Arrow } from './SwissMarks';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/packages/content/server';

export const FeaturedWork = ({ variant = 'home' }: { variant?: 'home' | 'work' }) => {
  const isWorkPage = variant === 'work';
  const aeem = PROJECTS.find((project) => project.slug === 'aeem-digital-presence');
  const others = PROJECTS.filter((project) => project.slug !== 'aeem-digital-presence');

  return (
    <section
      id="work"
      className="swiss-work site-gutter"
      aria-labelledby={isWorkPage ? undefined : 'work-heading'}
      aria-label={isWorkPage ? 'Project case studies and development notes' : undefined}
    >
      <div className="mx-auto max-w-[var(--layout-max)]">
        {!isWorkPage && (
          <div className="swiss-section-heading">
            <div>
              <p className="swiss-meta section-index">01 / Selected work</p>
              <h2 id="work-heading">
                See the problem.
                <br />
                <span className="text-accent">Follow the decisions.</span>
              </h2>
            </div>
            <Link prefetch={false} href="/work" className="swiss-text-link">
              Browse all projects{' '}
              <span aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </div>
        )}

        {aeem && (
          <article className="work-feature">
            <Link
              prefetch={false}
              href={`/work/${aeem.slug}`}
              className="work-canvas"
              aria-label="Read the AEEM website case study"
            >
              <div className="work-canvas-top" aria-hidden="true">
                <span>AEEM / EDUCATION & COMMUNITY</span>
                <span>Live website</span>
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
                  alt="The AEEM homepage: mission, navigation, and clear paths to get involved"
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
                {isWorkPage && <span className="work-status">Live</span>}
                <p className="mt-2 text-sm text-muted">Product thinking / UX / Development</p>
              </div>
              <div>
                <h3>
                  <Link prefetch={false} href={`/work/${aeem.slug}`}>
                    AEEM: a clearer way
                    <br />
                    to understand and take part.
                  </Link>
                </h3>
                <p className="mt-4 text-muted">
                  One website for AEEM’s mission, programmes and ways to volunteer, partner or
                  support. Read how I organised the content and built the journey.
                </p>
                {isWorkPage ? (
                  <div className="work-evidence">
                    <p>
                      <strong>My role:</strong> I initiated the website and worked on content
                      structure, user experience and development. I later volunteered as Chief
                      Operating Officer.
                    </p>
                    <p>
                      <strong>What the evidence says so far:</strong> The core team reviewed the
                      pages and navigation and responded positively. Wider visitor outcomes have not
                      been systematically measured.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    The core team reviewed the pages positively; wider visitor outcomes are not yet
                    measured.
                  </p>
                )}
              </div>
              <div className="work-links">
                <Link prefetch={false} href={`/work/${aeem.slug}`} className="swiss-text-link">
                  Read the AEEM case study
                </Link>
                {aeem.links?.live && (
                  <a
                    href={aeem.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-secondary-link"
                  >
                    Open the AEEM website (new tab)
                  </a>
                )}
              </div>
            </div>
          </article>
        )}

        {others.map((project) => (
          <article key={project.slug} className="work-row">
            <div>
              <p className="swiss-meta text-muted">In development</p>
              <span className="work-status">Development notes</span>
            </div>
            <div>
              <h3>
                <Link prefetch={false} href={`/work/${project.slug}`}>
                  {project.slug === 'mj-studio-backend'
                    ? 'Building the secure backend for a photography studio'
                    : project.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl text-muted">
                {project.slug === 'mj-studio-backend'
                  ? 'A system that lets a studio manage clients, galleries and deliveries safely: each studio sees only its own data, related changes save together, and key operations are checked automatically.'
                  : project.summary}
              </p>
              {isWorkPage && project.slug === 'mj-studio-backend' && (
                <div className="work-evidence">
                  <p>
                    <strong>My role:</strong> Backend design and engineering using TypeScript,
                    Express and Supabase.
                  </p>
                  <p>
                    <strong>What the evidence says so far:</strong> Automated backend tests and
                    PostgreSQL migration checks run in repository CI. The full photography workflow
                    has not yet been validated for launch.
                  </p>
                </div>
              )}
            </div>
            <Link
              prefetch={false}
              href={`/work/${project.slug}`}
              className="work-row-cta swiss-text-link"
              aria-label={`Read the development notes for ${project.title}`}
            >
              Read project notes
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
