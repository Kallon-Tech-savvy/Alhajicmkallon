import { Arrow } from './SwissMarks';
import Image from 'next/image';
import Link from 'next/link';

/** The display composition stays server-rendered; motion is handled in CSS. */
export const Hero = () => (
  <section className="swiss-hero site-gutter" aria-labelledby="hero-title">
    <div className="mx-auto max-w-[var(--layout-max)]">
      <div className="swiss-meta hero-meta">
        <span>
          <span className="signal-dot" /> Independent design engineer
        </span>
        <span>
          Freetown, Sierra Leone{' '}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </span>
      </div>

      <div className="hero-composition">
        <div className="hero-heading">
          <h1 id="hero-title" className="hero-title">
            A deliberate
            <br />
            <span>balance.</span>
          </h1>
          <p className="hero-balance-line">Understand the problem. Design the experience. Build what helps.</p>
        </div>
        <div className="hero-identity">
          <Image
            src="/assets/brand/alhaji-kallon-identity.jpg"
            alt="Alhaji C M Kallon — illustrated portrait, navy wordmark and orange emblem. A deliberate balance."
            width={1280}
            height={640}
            sizes="(max-width: 767px) 100vw, 55vw"
            className="identity-artwork"
          />
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-person">
          <Image
            src="/assets/kallon1.png"
            alt="Portrait of Alhaji C.M. Kallon, design engineer based in Freetown"
            width={56}
            height={56}
            loading="lazy"
            sizes="56px"
            className="hero-avatar"
          />
          <p>
            <strong>Alhaji C.M. Kallon</strong>
            <span>Design engineer, working from Freetown.</span>
          </p>
        </div>
        <div className="hero-introduction">
          <p>
            I work with organisations and founders to understand what is getting in people’s way,
            decide what is worth solving, and design and build the software to support it.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} href="#work" className="swiss-button">
              See project case studies{' '}
              <span aria-hidden="true">
                <Arrow direction="down-right" />
              </span>
            </Link>
            <Link prefetch={false} href="/contact" className="swiss-text-link">
              Describe your project{' '}
              <span aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
