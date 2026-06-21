'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    { title: "Innovation", desc: "Embracing creativity, experimentation, and continuous improvement to solve meaningful challenges." },
    { title: "Excellence", desc: "Maintaining high standards of quality, professionalism, and integrity in every endeavor." },
    { title: "Lifelong Learning", desc: "Remaining curious, adaptable, and committed to personal and professional growth." },
    { title: "Empowerment", desc: "Creating pathways for individuals and communities to realize their full potential." },
    { title: "Collaboration", desc: "Believing that the most impactful solutions emerge through collective effort." },
    { title: "Service", desc: "Using skills and knowledge to contribute positively to society." }
  ];

  return (
    <main className="min-h-screen bg-midnight">
      <Navbar />

      {/* Header */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-8 block">
              The Architect of Impact
            </span>
            <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.85]">
              ABOUT <br /><span className="text-gradient">ALHAJI</span>
            </h1>
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-0 text-white/[0.02] font-space text-[30vw] font-black leading-none pointer-events-none select-none">
          STORY
        </div>
      </section>

      {/* Intro Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/5] bg-navy rounded-sm overflow-hidden border border-white/5 relative"
            >
              <Image
                src="/images/kallon1.png"
                alt="Alhaji Kallon"
                fill
                className="object-cover grayscale"
              />
            </motion.div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-gold/20 -z-10" />
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="font-space text-gold text-xs font-black uppercase tracking-[0.3em] mb-6">The Short Version</h2>
              <p className="text-ivory text-2xl md:text-4xl font-inter font-light leading-snug tracking-tight">
                Alhaji C. M. Kallon is a <span className="text-gold font-medium italic">Sierra Leonean</span> design engineer, software developer, entrepreneur, and writer committed to advancing innovation and building solutions that create lasting impact.
              </p>
            </div>

            <div className="space-y-8 text-muted text-lg font-inter leading-relaxed">
              <p>
                As a design engineer and software developer, I build digital solutions that address real-world challenges. My work spans software engineering, product development, artificial intelligence, and systems design.
              </p>
              <p>
                But technology alone is never the answer. The real work is bridging the gap between what&apos;s possible and what&apos;s needed — ensuring that innovation remains accessible, relevant, and impactful for the people it&apos;s meant to serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Story Section */}
      <section className="py-32 bg-navy/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="font-space text-xs font-black uppercase tracking-[0.4em] text-gold">The Full Story</h2>
            <div className="flex-1 h-[1px] bg-gold/20" />
          </div>

          <div className="space-y-16 text-ivory/80 text-xl font-inter leading-relaxed font-light">
            <p>
              I grew up fascinated by how ideas become reality. Not just in theory, but in practice — how a thought transforms into a sketch, a sketch into a prototype, and a prototype into something that changes how people live and work.
            </p>
            <p>
              Beyond technology, I&apos;m deeply committed to youth empowerment and capacity building. I&apos;ve worked with youth-focused organizations and innovation ecosystems that equip young people with the skills, mindset, and opportunities they need to thrive.
            </p>
            <p className="border-l-4 border-l-gold pl-8 py-4 italic text-2xl text-ivory font-cormorant">
              &quot;My mission is to leverage technology, innovation, and human-centered design to empower individuals and strengthen institutions across Africa.&quot;
            </p>
            <p>
              I believe that ideas have the power to shape societies, and that sharing knowledge is one of the most effective ways to create positive change. Through technology, innovation, and education, I&apos;m working to play a role in building that future.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter mb-8">CORE <span className="text-muted">VALUES</span></h2>
            <div className="w-24 h-[1px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-10 border-t-2 border-t-gold/50 group hover:border-t-gold transition-all duration-500"
              >
                <div className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-6">Value 0{i+1}</div>
                <h3 className="font-space text-2xl font-bold mb-6 group-hover:text-gold transition-colors">{v.title}</h3>
                <p className="text-muted text-sm font-inter leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
