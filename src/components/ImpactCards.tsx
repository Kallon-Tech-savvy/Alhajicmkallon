import { Cpu, Lightbulb, Users, PenTool } from 'lucide-react';

const impactAreas = [
  {
    title: "Problem discovery",
    desc: "Understand the people, context, and current workarounds before deciding what deserves to be solved.",
    icon: <Cpu className="text-gold" size={24} aria-hidden="true" />,
    color: "from-blue-500/10 to-transparent"
  },
  {
    title: "Product thinking",
    desc: "Turn a broad idea into a clearer value proposition, surface risky assumptions, and define a useful first version.",
    icon: <Lightbulb className="text-gold" size={24} aria-hidden="true" />,
    color: "from-yellow-500/10 to-transparent"
  },
  {
    title: "Experience design",
    desc: "Shape the information, flows, and interfaces around what people need to understand and do.",
    icon: <Users className="text-gold" size={24} aria-hidden="true" />,
    color: "from-blue-500/10 to-transparent"
  },
  {
    title: "Engineering",
    desc: "Build and improve the product with attention to usability, performance, reliability, and the constraints the team actually has.",
    icon: <PenTool className="text-gold" size={24} aria-hidden="true" />,
    color: "from-purple-500/10 to-transparent"
  }
];

export const ImpactCards = () => {
  return (
    <section className="py-24 bg-midnight px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 block font-space text-[11px] font-semibold uppercase tracking-[0.3em] text-pride-blue">
              How I work
            </span>
            <h2 className="font-space text-3xl font-semibold tracking-[-0.02em] text-ivory md:text-4xl">
              From the right question. <span className="text-[#9AA4B2]">To a product people can use.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#9AA4B2]">
            I work across the decisions that shape a product: what problem matters, what the first version needs to do, how people will use it, and how to build it reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactAreas.map((area, i) => (
            <div
              key={area.title}     
              className="glass p-8 rounded-2xl group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="mb-6 w-fit rounded-xl bg-white/5 p-3 transition-colors group-hover:bg-pride-blue/10">
                {area.icon}
              </div>
              <h3 className="mb-3 font-space text-xl font-semibold text-ivory">{area.title}</h3>
              <p className="font-inter text-sm leading-7 text-[#9AA4B2]">
                {area.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
