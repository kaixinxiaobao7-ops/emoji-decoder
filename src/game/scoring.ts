import type { Question, ScoreResult } from './types';

/** Normalize punctuation, width variants, case and whitespace away. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function levenshtein(a: string, b: string): number {
  const left = Array.from(a);
  const right = Array.from(b);
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[right.length];
}

export function textSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const maxLength = Math.max(Array.from(a).length, Array.from(b).length);
  if (!maxLength) return 0;
  return Math.min(1, Math.max(0, 1 - levenshtein(a, b) / maxLength));
}

/**
 * Score one answer.
 *
 * - Three distinct keyword hits max out the keyword component. Keyword lists
 *   contain synonyms, so dividing by every alias would punish a correct answer
 *   that happens to use only one synonym.
 * - Levenshtein similarity contributes at most 10 points.
 * - A normalized exact match is always 100.
 * - No keyword hits give the question's friendly participation score.
 */
export function scoreAnswer(question: Question, rawText: string): ScoreResult {
  const normalized = normalizeText(rawText);
  if (normalized.length < 2) {
    return {
      score: 0,
      tooShort: true,
      matched: [],
      fallback: true,
      similarity: 0,
      reference: question.answers[0]?.text ?? '',
    };
  }

  const exactMatch = question.answers.some(
    (answer) => normalizeText(answer.text) === normalized,
  );

  let best:
    | {
        total: number;
        matched: string[];
        similarity: number;
        answer: Question['answers'][number];
        keywordScore: number;
      }
    | null = null;

  for (const answer of question.answers) {
    const seen = new Set<string>();
    const matched: string[] = [];

    answer.keywords.forEach((keyword) => {
      const key = normalizeText(keyword);
      if (key && normalized.includes(key) && !seen.has(key)) {
        seen.add(key);
        matched.push(keyword);
      }
    });

    const keywordCoverage = Math.min(matched.length / 3, 1);
    const keywordScore = matched.length
      ? answer.score * (0.6 + 0.4 * keywordCoverage)
      : 0;
    const similarity = textSimilarity(normalized, normalizeText(answer.text));
    const bonus = Math.round(similarity * 10);
    const total = keywordScore + bonus;

    if (!best || total > best.total) {
      best = { total, matched, similarity, answer, keywordScore };
    }
  }

  if (!best || best.matched.length === 0) {
    const fallbackScore = question.fallback ?? 25;
    return {
      score: Math.min(
        fallbackScore + Math.round((best?.similarity ?? 0) * 5),
        fallbackScore + 5,
      ),
      tooShort: false,
      matched: [],
      fallback: true,
      similarity: best?.similarity ?? 0,
      reference: best?.answer.text ?? question.answers[0]?.text ?? '',
    };
  }

  return {
    score: exactMatch ? 100 : Math.min(100, Math.max(0, Math.round(best.total))),
    tooShort: false,
    matched: best.matched.slice(0, 4),
    fallback: false,
    similarity: best.similarity,
    reference: best.answer.text,
    hitRate: Math.min(best.matched.length / 3, 1),
  };
}
