import { FAQ_ENTRIES } from './Knowledgebase';

/**
 * Local, zero-cost, zero-latency first pass matcher.
 */
export function matchFaq(message: string): string | null {
  const text = message.toLowerCase();
  let best: { answer: string; score: number } | null = null;

  for (const entry of FAQ_ENTRIES) {
    let score = 0;
    
    for (const keyword of entry.triggerKeywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      if (lowerKeyword.includes(' ')) {
        // Multi-word phrases remain safe with standard substring checks
        if (text.includes(lowerKeyword)) score += 1;
      } else {
        // Enforce strict word boundaries for singular terms (prevents matching "caprice" for "price")
        const regex = new RegExp(`\\b${escapeRegExp(lowerKeyword)}\\b`, 'i');
        if (regex.test(text)) score += 1;
      }
    }
    
    if (score >= entry.minMatches && (!best || score > best.score)) {
      best = { answer: entry.answer, score };
    }
  }

  return best?.answer ?? null;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}