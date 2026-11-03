export const VisionMap = () => {
  return (
    <section className="section-space bg-navy relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)', backgroundSize: '60px 60px' }} />

      <div className="max-w-[var(--layout-max)] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span  
            className="font-display text-accent text-xs font-bold tracking-[0.16em] uppercase block mb-6"
          >
            Regional Impact
          </span>
          <h2  
            className="font-display text-5xl md:text-7xl font-bold tracking-tighter"
          >
            BEYOND <span className="text-muted">BORDERS.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
             {/* Abstract Africa Map SVG or Placeholder */}
             <div className="w-full h-full bg-surface border border-border rounded-full flex items-center justify-center relative">
                <div  
                  className="w-3/4 h-3/4 border-2 border-accent/20 rounded-full flex items-center justify-center italic font-cormorant text-accent/40 text-4xl"
                >
                  AFRICA
                </div>

                {/* Hotspots */}
                <div  
                   className="absolute top-1/4 right-1/3 w-4 h-4 bg-accent rounded-full"
                />
                <div  
                   className="absolute bottom-1/2 left-1/4 w-3 h-3 bg-accent/50 rounded-full"
                />
             </div>
          </div>

          <div className="space-y-12">
            <div className="glass p-8 border-l-4 border-l-accent">
              <h3 className="font-display text-2xl font-bold mb-4 tracking-tighter uppercase">Localized AI</h3>
              <p className="text-muted font-body leading-relaxed">
                Building LLMs and computer vision systems that understand regional languages
                and cultural nuances, starting with Sierra Leone.
              </p>
            </div>

            <div className="glass p-8 border-l-4 border-l-white/10">
              <h3 className="font-display text-2xl font-bold mb-4 tracking-tighter uppercase">Digital Infrastructure</h3>
              <p className="text-muted font-body leading-relaxed">
                Architecting scalable platforms for government and education that operate
                seamlessly in low-bandwidth environments.
              </p>
            </div>

            <div className="glass p-8 border-l-4 border-l-white/10">
              <h3 className="font-display text-2xl font-bold mb-4 tracking-tighter uppercase">Youth Ecosystems</h3>
              <p className="text-muted font-body leading-relaxed">
                Creating digital pipelines for mentorship and skills development to empower
                the next 10 million African innovators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
