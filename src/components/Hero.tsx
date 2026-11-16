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
        <h1 id="hero-title" className="hero-title">
          Bold ideas.
          <br />
          <span>Useful things.</span>
        </h1>
        <div className="hero-poster" aria-hidden="true">
          <div className="poster-top">
            <span>AK / DESIGN ENGINEERING</span>
            <span>001</span>
          </div>
          <svg className="poster-symbol" viewBox="0 0 240 240" fill="none">
            <path
              d="M0 80H240M0 160H240M80 0V240M160 0V240"
              stroke="currentColor"
              strokeOpacity=".2"
            />
            <circle cx="120" cy="120" r="80" fill="var(--brand-orange)" />
            <path d="M67 173 173 67M69 67h104v104" stroke="var(--brand-paper)" strokeWidth="20" />
            <circle cx="40" cy="40" r="9" fill="var(--brand-paper)" />
            <path d="M190 204h28m-14-14v28" stroke="var(--brand-paper)" strokeWidth="2" />
          </svg>
          <div className="poster-bottom">
            <span>THINK. SHAPE. BUILD.</span>
            <span>
              <Arrow />
            </span>
          </div>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-person">
          <Image
            src="/assets/kallon1.png"
            alt="Alhaji C.M. Kallon"
            width={56}
            height={56}
            loading="lazy"
            sizes="56px"
            className="hero-avatar"
          />
          <p>
            <strong>Alhaji C.M. Kallon</strong>
            <span>Curious mind. Hands-on maker.</span>
          </p>
        </div>
        <div className="hero-introduction">
          <p>
            I connect product thinking, design and engineering to turn unclear ideas into digital
            products people can use.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} href="#work" className="swiss-button">
              Explore the work{' '}
              <span aria-hidden="true">
                <Arrow direction="down-right" />
              </span>
            </Link>
            <Link prefetch={false} href="/contact" className="swiss-text-link">
              Let’s make something{' '}
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
