import { QUESTIONS } from './questions';
import { TOTAL_ROUNDS } from './constants';
import type { Player, Question, RankedPlayer } from './types';

export function shuffle<T>(items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 3 warm-up questions + 3 creative ones + 2 high-difficulty ones. */
export function drawQuestions(): Question[] {
  const byLevel = (level: 1 | 2 | 3) =>
    shuffle(QUESTIONS.filter((question) => question.level === level));

  return [
    ...byLevel(1).slice(0, 3),
    ...byLevel(2).slice(0, 3),
    ...byLevel(3).slice(0, Math.max(0, TOTAL_ROUNDS - 6)),
  ];
}

export function getRanking(
  players: readonly Player[],
  scores: Readonly<Record<string, number>>,
): RankedPlayer[] {
  return players
    .map((player) => ({
      ...player,
      score: scores[player.id] ?? 0,
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((player, index, all) => {
      const rank = index > 0 && all[index - 1].score === player.score
        ? all[index - 1].rank
        : index + 1;
      return { ...player, rank };
    });
}
