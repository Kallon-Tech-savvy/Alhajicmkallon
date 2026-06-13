'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CustomCursor } from '@/components/CustomCursor';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { ImpactCards } from '@/components/ImpactCards';
import { Timeline } from '@/components/Timeline';
import { FeaturedWork } from '@/components/FeaturedWork';
import { ThoughtLeadership } from '@/components/ThoughtLeadership';
import { VisionMap } from '@/components/VisionMap';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-midnight">
      <LoadingScreen />
      <CustomCursor />
      <Navbar />

      <Hero />
      <Manifesto />
      <ImpactCards />
      <Timeline />
      <FeaturedWork />
      <ThoughtLeadership />
      <VisionMap />

      {/* Quote Section */}
      <section className="py-48 px-6 bg-navy relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-cormorant italic text-3xl md:text-5xl text-ivory leading-relaxed mb-12">
              "The future is built by those willing to transform ideas into opportunities and opportunities into impact."
            </h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mb-6" />
            <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase">
              Alhaji Kallon
            </span>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-space text-[40vw] font-black pointer-events-none select-none">
          FUTURE
        </div>
      </section>

      <Footer />
    </main>
  );
}
