'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mic2, Calendar, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SpeakingPage() {
  const topics = [
    {
      title: "Building Africa's Innovation Future",
      desc: "How young Africans are leveraging technology to solve local challenges and why the world should pay attention.",
      audience: "Conferences, Corporate events, Universities",
      format: "Keynote (30-45 min)"
    },
    {
      title: "Design Thinking for Social Impact",
      desc: "A practical framework for solving complex problems in low-resource contexts using human-centered design.",
      audience: "NGOs, Social Enterprises, Government Agencies",
      format: "Workshop (2-4 hours)"
    },
    {
      title: "AI for Development: Opportunities and Ethics",
      desc: "How artificial intelligence can accelerate development in Africa while ensuring ethical, inclusive implementation.",
      audience: "Tech Conferences, Policy Forums",
      format: "Expert Panel or Keynote"
    }
  ];

  const engagements = [
    { event: "Africa Tech Summit", org: "ATS", location: "Nairobi, Kenya", date: "Feb 2023", talk: "Building Africa's Innovation Future" },
    { event: "Global AI Summit", org: "GAIS", location: "Riyadh, Saudi Arabia", date: "Sep 2022", talk: "AI for Development" },
    { event: "UNDP Youth Forum", org: "UNDP", location: "Virtual", date: "Jun 2022", talk: "Design Thinking for Impact" }
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
              Voices of Change
            </span>
            <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.85]">
              SPEAKING & <br /><span className="text-gradient">WORKSHOPS</span>
            </h1>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-0 text-white/[0.02] font-space text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">
          TALKS
        </div>
      </section>

      {/* Intro */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ivory text-2xl md:text-4xl font-inter font-light leading-relaxed">
            I deliver keynotes, workshops, and panel discussions on <span className="text-gold italic font-medium">technology</span>, innovation, and youth empowerment across Africa and beyond.
          </p>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-32 px-6 bg-navy/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-24">
            <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter uppercase">Speaking <span className="text-muted">Topics</span></h2>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-10 flex flex-col h-full border border-white/5 hover:border-gold/30 transition-all duration-500 group"
              >
                <div className="p-4 bg-gold/10 w-fit rounded-xl text-gold mb-8 group-hover:scale-110 transition-transform">
                  <Mic2 size={24} />
                </div>
                <h3 className="font-space text-2xl font-bold mb-6 text-ivory group-hover:text-gold transition-colors">{topic.title}</h3>
                <p className="text-muted text-sm font-inter leading-relaxed mb-10 flex-grow">{topic.desc}</p>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-gold mt-1 shrink-0" />
                    <div>
                      <div className="text-[10px] font-space font-black uppercase tracking-widest text-muted">Audience</div>
                      <div className="text-xs text-ivory/80">{topic.audience}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Engagements Table-ish */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-24">
            <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter uppercase">Past <span className="text-muted">Engagements</span></h2>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="space-y-2">
            {engagements.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border-b border-white/5 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start lg:items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 text-gold font-space font-black text-xs uppercase tracking-widest">
                    <Calendar size={14} /> {e.date}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="font-space text-xl font-bold text-ivory">{e.event}</h3>
                  <div className="text-muted text-xs font-inter uppercase tracking-widest mt-1">{e.org}</div>
                </div>
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 text-muted font-inter text-sm">
                    <MapPin size={14} className="text-gold/50" /> {e.location}
                  </div>
                </div>
                <div className="lg:col-span-2 text-right w-full">
                  <button className="p-3 rounded-full border border-white/10 text-muted hover:text-gold hover:border-gold transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-48 px-6 bg-gold relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-space text-5xl md:text-7xl font-black tracking-tighter text-midnight mb-12">BOOK ME TO SPEAK</h2>
          <p className="text-midnight/80 text-xl font-inter mb-12">
            Interested in having me share insights at your next event or conduct a workshop for your organization?
          </p>
          <Link
            href="/contact"
            className="inline-flex px-12 py-6 bg-midnight text-ivory font-space font-black text-sm uppercase tracking-widest hover:bg-ivory hover:text-midnight transition-all duration-500"
          >
            Get in Touch
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-ivory/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      <Footer />
    </main>
  );
}
