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
          <p className="hero-balance-line">Design, engineering and curiosity, held in balance.</p>
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
            <span>I listen first, then design and build.</span>
          </p>
        </div>
        <div className="hero-introduction">
          <p>
            I help founders, businesses and organisations turn unclear ideas into digital
            products people can use, from the first question to the working product.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} href="#work" className="swiss-button">
              Explore the work{' '}
              <span aria-hidden="true">
                <Arrow direction="down-right" />
              </span>
            </Link>
            <Link prefetch={false} href="/contact" className="swiss-text-link">
              Start a conversation{' '}
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
