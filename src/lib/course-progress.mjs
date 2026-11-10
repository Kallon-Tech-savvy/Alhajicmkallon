export const COURSE_PROGRESS_KEY = 'protocol-course-progress-v1';
export function parseCourseProgress(raw, slugs) {
  if (typeof raw !== 'string' || raw.length > 12000) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || value.enabled !== true) return null;
    const allowed = new Set(slugs);
    return { version: 1, enabled: true, last: allowed.has(value.last) ? value.last : null,
      practised: Array.isArray(value.practised) ? [...new Set(value.practised.filter(slug => typeof slug === 'string' && allowed.has(slug)))] : [] };
  } catch { return null; }
}
export function togglePractised(progress, slug, slugs) {
  if (!slugs.includes(slug)) return progress;
  const practised = new Set(progress.practised);
  if (practised.has(slug)) practised.delete(slug); else practised.add(slug);
  return { ...progress, last: slug, practised: [...practised] };
}
