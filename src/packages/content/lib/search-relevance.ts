export interface SearchDocument {
  title: string;
  summary: string;
  metadata: string[];
  body: string;
}

function normalize(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function words(value: string) {
  return new Set(normalize(value).match(/[\p{L}\p{N}]+/gu) ?? []);
}

/** Require every query word; favour authored labels over incidental body mentions. */
export function rankSearchEntries<T>(
  entries: readonly T[],
  query: string,
  document: (entry: T) => SearchDocument,
): T[] {
  const phrase = normalize(query);
  const terms = [...words(phrase)];
  if (!terms.length) return [];
  return entries
    .map((entry, index) => {
      const fields = document(entry);
      const title = normalize(fields.title);
      const summary = normalize(fields.summary);
      const metadata = normalize(fields.metadata.join(' '));
      // Link destinations are references, not evidence that an article teaches a topic.
      const body = fields.body.replace(/\]\([^)]+\)/g, ']').replace(/https?:\/\/\S+/g, '');
      const sets = [words(title), words(summary), words(metadata), words(body)];
      if (!terms.every((term) => sets.some((set) => set.has(term))))
        return { entry, index, score: 0 };
      const weights = [30, 10, 15, 1];
      const score =
        (title === phrase ? 1000 : 0) +
        (title.includes(phrase) ? 200 : 0) +
        (summary.includes(phrase) ? 50 : 0) +
        terms.reduce(
          (sum, term) =>
            sum +
            sets.reduce((total, set, field) => total + (set.has(term) ? weights[field] : 0), 0),
          0,
        );
      return { entry, index, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.entry);
}
