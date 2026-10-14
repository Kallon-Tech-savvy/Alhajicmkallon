const milestones = [
  { year: '2020', title: 'Choosing a direction', desc: 'After exploring Civil Engineering and Computer Science, I chose to pursue the field that best matched my interest in how systems work and how ideas become real.' },
  { year: '2022', title: 'Building foundations', desc: 'Started a Computer Science programme at Central University Sierra Leone and helped fellow students work through projects and core concepts.' },
  { year: '2024', title: 'A different learning path', desc: 'Financial pressure and personal decisions led me to leave university and continue learning independently through focused study and practical work.'},
  { year: '2026', title: 'Building for real use', desc: 'Focused on taking projects from early ideas through product decisions, design, implementation, and practical use.'}
];

export const Timeline = () => {
  return (
    <section className="py-24 bg-midnight px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-20">
          <h2 className="font-space text-2xl font-bold tracking-tighter uppercase italic text-muted">The path so far</h2>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {milestones.map((m, i) => (
            <div
              key={i}    
              className="relative"
            >
              <div className="font-space text-6xl font-black text-white/5 absolute -top-10 -left-4 select-none">
                {m.year}
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center text-gold font-space font-bold text-xs mb-6 border border-gold/20">
                  0{i+1}
                </div>
                <h3 className="font-space text-lg font-bold text-ivory mb-2 uppercase tracking-widest">{m.title}</h3>
                <p className="text-muted text-sm font-inter leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
