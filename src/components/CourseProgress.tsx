'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { COURSE_PROGRESS_KEY, parseCourseProgress, togglePractised } from '@/lib/course-progress.mjs';

type Progress = { version: number; enabled: boolean; last: string | null; practised: string[] };
type Lesson = { slug: string; title: string };
const CHANGE_EVENT = 'protocol-progress-change';
function subscribe(notify: () => void) {
  const sync = (event: StorageEvent) => { if (event.key === COURSE_PROGRESS_KEY || event.key === null) notify(); };
  window.addEventListener('storage', sync);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => { window.removeEventListener('storage', sync); window.removeEventListener(CHANGE_EVENT, notify); };
}
function snapshot() { try { return localStorage.getItem(COURSE_PROGRESS_KEY); } catch { return null; } }
function serverSnapshot() { return null; }
export function CourseProgress({ lessons, currentSlug }: { lessons: Lesson[]; currentSlug?: string }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const progress: Progress | null = parseCourseProgress(raw, lessons.map(lesson => lesson.slug));
  const [notice, setNotice] = useState('');
  const [confirmForget, setConfirmForget] = useState(false);
  useEffect(() => {
    const saved = parseCourseProgress(snapshot(), lessons.map(lesson => lesson.slug));
    if (saved && currentSlug && lessons.some(lesson => lesson.slug === currentSlug) && saved.last !== currentSlug) {
      try { localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify({ ...saved, last: currentSlug })); window.dispatchEvent(new Event(CHANGE_EVENT)); }
      catch { /* Saving is optional; explicit controls report storage failures. */ }
    }
  }, [lessons, currentSlug]);
  const save = (next: Progress) => {
    try { localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event(CHANGE_EVENT)); setNotice('Saved on this device.'); }
    catch { setNotice('Progress could not be saved in this browser. You can still read and practise.'); }
  };
  const last = lessons.find(lesson => lesson.slug === progress?.last);
  const next = lessons.find(lesson => !progress?.practised.includes(lesson.slug));
  return <section aria-labelledby="course-progress-heading" className="site-gutter border-b border-border py-8"><div className="mx-auto max-w-4xl rounded-lg border border-border bg-surface p-6">
    <h2 id="course-progress-heading" className="text-xl font-medium">{currentSlug ? 'Record your practice' : 'Continue your learning'}</h2>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Remembering is optional. Saved progress stays in this browser; it is not sent to the server or synced to other devices. Opening a lesson does not mark it practised.</p>
    {!progress ? <button type="button" onClick={() => save({ version: 1, enabled: true, last: currentSlug ?? null, practised: [] })} className="mt-5 ui-primary">Remember progress on this device</button> : <>
      <p className="mt-4 text-sm text-muted">{progress.practised.length} of {lessons.length} lessons marked practised. This is your record, not an assessment or certificate.</p>
      {currentSlug && <button type="button" aria-pressed={progress.practised.includes(currentSlug)} onClick={() => save(togglePractised(progress, currentSlug, lessons.map(lesson => lesson.slug)))} className="mt-4 min-h-11 rounded border border-border bg-midnight px-4 py-2 text-sm font-medium hover:bg-navy">{progress.practised.includes(currentSlug) ? 'Marked practised — undo' : 'Mark this lesson practised'}</button>}
      {!currentSlug && <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">{last && <Link prefetch={false} href={`/knowledge/${last.slug}`} className="editorial-link">Resume: {last.title} →</Link>}{next && next.slug !== last?.slug && <Link prefetch={false} href={`/knowledge/${next.slug}`} className="editorial-link">Next unmarked lesson →</Link>}</div>}
      <details className="mt-5 border-t border-border pt-3"><summary className="cursor-pointer py-2 text-sm font-medium text-accent">View your lesson record</summary><ol className="mt-3 grid gap-2 sm:grid-cols-2">{lessons.map((lesson,index)=><li key={lesson.slug} className="rounded border border-border bg-midnight p-3"><Link prefetch={false} href={`/knowledge/${lesson.slug}`} aria-current={lesson.slug === currentSlug ? 'page' : undefined} className="text-sm underline underline-offset-4">{index+1}. {lesson.title}</Link><p className="mt-2 text-xs text-muted">{progress.practised.includes(lesson.slug) ? 'Practised' : 'Not marked'}</p></li>)}</ol></details>
      <div className="mt-5 border-t border-border pt-4">{!confirmForget ? <button type="button" onClick={() => setConfirmForget(true)} className="min-h-11 text-sm text-muted underline underline-offset-4">Forget saved progress</button> : <div><p className="text-sm">Remove this course record from this browser and stop remembering?</p><div className="mt-3 flex gap-5"><button type="button" onClick={() => { try { localStorage.removeItem(COURSE_PROGRESS_KEY); window.dispatchEvent(new Event(CHANGE_EVENT)); setConfirmForget(false); setNotice('Saved course progress removed. Remembering is off.'); } catch { setNotice('The saved record could not be removed. Check your browser storage settings.'); } }} className="min-h-11 text-sm font-semibold text-danger underline">Remove record</button><button type="button" onClick={() => setConfirmForget(false)} className="min-h-11 text-sm underline">Keep record</button></div></div>}</div>
    </>}
    <p role="status" aria-live="polite" className="mt-3 text-sm leading-relaxed text-muted">{notice}</p>
  </div></section>;
}
