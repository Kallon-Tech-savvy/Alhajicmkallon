import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy and performance measurement',
  description: 'How alhajikallon.com handles optional anonymous website-performance measurements and communication.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />
      <section className="page-intro mx-auto max-w-3xl site-gutter">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent">Privacy</p>
        <h1 className="page-title mb-8 font-bold tracking-tight">
          Your visit should not require tracking.
        </h1>
        <p className="mb-10 text-lg leading-8 text-[var(--color-muted)]">
          This website does not require an account to browse the work, writing or knowledge notes.
          Its optional performance-measurement feature is disabled unless deliberately activated.
        </p>
        <div className="space-y-9 text-sm leading-7 text-[var(--color-muted)]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-ivory">Website performance</h2>
            <p>
              If enabled, approximately one in five page visits may send basic measurements such
              as page loading speed, visual stability and responsiveness. These reports include
              the metric name and value, a broad page category (such as Work or Writing), and
              whether the viewport is small or large. They do not include your name, full page
              URL, search terms, cookies or a persistent visitor identifier. Browsers signaling
              Global Privacy Control or Do Not Track are excluded.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-ivory">Where information goes</h2>
            <p>
              Performance reports go to this website’s own server and, when collection is enabled,
              appear in application logs. They are not sent to a third-party analytics SDK. The
              hosting or security provider may independently process ordinary request metadata,
              such as IP addresses, for delivering and protecting the website. Their retention
              practices are separate from the anonymous application-level measurement.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-ivory">Contact and enquiries</h2>
            <p>
              If you voluntarily contact me, I use the details you provide to respond to your
              enquiry. For questions about website privacy or your communication, email{' '}
              <a className="text-[var(--color-accent)] underline underline-offset-4" href="mailto:info@alhajikallon.com">
                info@alhajikallon.com
              </a>.
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
