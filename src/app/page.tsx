'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { ImpactCards } from '@/components/ImpactCards';
import { Timeline } from '@/components/Timeline';
import { FeaturedWork } from '@/components/FeaturedWork';
import { ThoughtLeadership } from '@/components/ThoughtLeadership';
import { SpeakingHighlights } from '@/components/SpeakingHighlights';
import { VisionMap } from '@/components/VisionMap';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <Hero />
      <Manifesto />
      <ImpactCards />
      <Timeline />
      <FeaturedWork />
      <ThoughtLeadership />
      <SpeakingHighlights />
      <VisionMap />

      {/* Quote Section */}
      <section className="py-64 px-6 bg-midnight relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="font-cormorant italic text-4xl md:text-6xl text-ivory leading-[1.2] mb-16">
              &quot;Innovation is most meaningful when it expands opportunity, empowers people,
              and creates lasting value for society.&quot;
            </h2>
            <div className="w-24 h-[1px] bg-gold mx-auto mb-8" />
            <span className="font-space text-gold text-[10px] font-black tracking-[0.6em] uppercase">
              The Professional Philosophy
            </span>
          </motion.div>
        </div>

        {/* Parallax Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.01] font-space text-[40vw] font-black pointer-events-none select-none">
          VALUES
        </div>
      </section>

      <NewsletterCTA />
      <Footer />
    </main>
  );
}
