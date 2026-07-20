import { KNOWLEDGE_CHUNKS, KnowledgeChunk } from './Knowledgebase';

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Common conversational filler words that distort simple keyword matching
const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 
  'for', 'from', 'how', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'or', 
  'please', 'tell', 'the', 'this', 'to', 'was', 'what', 'who', 'with', 'you', 'your'
]);

function tokenize(text: string): string[] {
  const rawTokens = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  return rawTokens.filter(token => !STOP_WORDS.has(token));
}

export function selectRelevantChunks(
  message: string,
  history: HistoryMessage[],
  topK = 5
): KnowledgeChunk[] {
  const recentUserContext = history
    .filter((h) => h.role === 'user')
    .slice(-2)
    .map((h) => h.content)
    .join(' ');
    
  const queryText = `${message} ${recentUserContext}`.toLowerCase();
  const queryTokens = new Set(tokenize(queryText));

  const scorable = KNOWLEDGE_CHUNKS.filter((c) => !c.alwaysInclude && !c.defaultInclude);
  const always = KNOWLEDGE_CHUNKS.filter((c) => c.alwaysInclude);
  const defaults = KNOWLEDGE_CHUNKS.filter((c) => c.defaultInclude);

  const scored = scorable
    .map((chunk) => {
      let score = 0;
      for (const rawKeyword of chunk.keywords) {
        const keyword = rawKeyword.toLowerCase();
        
        if (keyword.includes(' ')) {
          // Multi-word phrase matching receives a massive boost for direct semantic matches
          if (queryText.includes(keyword)) score += 4;
        } else {
          // Strict token matches
          if (queryTokens.has(keyword)) {
            score += 3;
          } else if (queryText.includes(keyword)) {
            // Partial substring matches get a conservative fallback weight
            score += 1;
          }
        }
      }
      return { chunk, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK).map((s) => s.chunk);

  if (top.length === 0) {
    return [...always, ...defaults];
  }

  return [...always, ...top];
}