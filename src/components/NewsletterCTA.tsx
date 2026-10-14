import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const NewsletterCTA = () => (
  <section className="py-32 px-6 bg-gold relative overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}
    />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <div   >
        <span className="font-space text-midnight text-xs font-black tracking-[0.4em] uppercase mb-8 block">
          Notes from the work
        </span>
        <h2 className="font-space text-4xl md:text-6xl font-black tracking-tighter text-midnight mb-8 leading-tight">
          THINK CLEARLY. <br />BUILD USEFULLY.
        </h2>
        <p className="text-midnight/70 text-lg md:text-xl font-medium font-inter mb-12 max-w-2xl mx-auto">
          Notes on product decisions, technology, and building digital products—written to make the reasoning behind the work more useful and reusable.
        </p>
        <Link
          href="/writing"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-midnight text-ivory font-space font-black text-xs uppercase tracking-[0.2em] hover:bg-ivory hover:text-midnight transition-colors duration-300"
        >
          Read the notes <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </section>
);
