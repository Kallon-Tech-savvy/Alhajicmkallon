import { PROTOCOL_VISUALS } from '@/lib/protocol-visuals';

/** Server-rendered diagrams and native disclosure: no lesson UI runtime. */
export function ProtocolLessonVisual({ lessonIndex }: { lessonIndex: number }) {
  const visual = PROTOCOL_VISUALS[lessonIndex - 1];
  if (!visual) return null;
  return <section aria-labelledby="protocol-visual-heading" className="site-gutter border-b border-border py-12"><div className="mx-auto max-w-4xl space-y-8">
    <figure><figcaption><p className="editorial-kicker text-muted">Mechanism map · Lesson {lessonIndex + 1}</p><h2 id="protocol-visual-heading" className="mt-2 text-2xl font-medium">{visual.title}</h2></figcaption>
      <ol className="mt-6 space-y-0">{visual.steps.map((step,index)=><li key={step.label}><div className="grid grid-cols-[2rem_1fr] gap-4 rounded-lg border border-border bg-surface p-5"><span className="font-mono text-sm text-accent">{String(index+1).padStart(2,'0')}</span><div><h3 className="font-medium">{step.label}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p></div></div>{index < visual.steps.length-1 && <div aria-hidden="true" className="pl-8 py-1 text-xl text-accent">↓</div>}</li>)}</ol>
      <p className="mt-4 text-sm leading-relaxed text-muted">Conceptual sequence. Read the conditions below before treating it as an implementation guarantee.</p>
    </figure>
    <aside className="rounded-lg border border-border p-6"><p className="editorial-kicker text-muted">Apply the mechanism</p><h2 className="mt-2 text-xl font-medium">{visual.exercise}</h2><p className="mt-4 leading-relaxed">{visual.prompt}</p><p className="mt-3 text-sm leading-relaxed text-muted">Before opening the answer, identify the observation, the claim it supports and one assumption you still need to check.</p><details className="mt-5 border-t border-border pt-3"><summary className="cursor-pointer py-3 font-medium text-accent">Reveal worked reasoning</summary><dl className="mt-4 space-y-5 text-sm leading-relaxed"><div><dt className="font-semibold">Reasoning</dt><dd className="mt-2 text-muted">{visual.answer}</dd></div><div><dt className="font-semibold">Assumptions and limits</dt><dd className="mt-2 text-muted">{visual.limits}</dd></div><div><dt className="font-semibold">Verification</dt><dd className="mt-2 text-muted">{visual.verify}</dd></div></dl></details></aside>
  </div></section>;
}
