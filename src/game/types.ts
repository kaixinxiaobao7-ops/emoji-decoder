export type Phase = 'start' | 'playing' | 'revealing' | 'finished';

export type Difficulty = 1 | 2 | 3;

export interface AnswerDefinition {
  text: string;
  score: number;
  keywords: string[];
}

export interface Question {
  id: string;
  level: Difficulty;
  tag: string;
  emoji: string;
  answers: AnswerDefinition[];
  fallback: number;
}

export interface Player {
  id: string;
  name: string;
  emoji: string;
}

export interface ScoreResult {
  score: number;
  tooShort: boolean;
  matched: string[];
  fallback: boolean;
  similarity: number;
  reference: string;
  hitRate?: number;
}

export interface RoundAnswer {
  playerId: string;
  playerName: string;
  playerEmoji: string;
  text: string;
  score: number;
  matched: string[];
  fallback: boolean;
  tooShort: boolean;
  round: number;
}

export interface BestMoment {
  playerName: string;
  playerEmoji: string;
  text: string;
  score: number;
  round: number;
}

export interface RankedPlayer extends Player {
  score: number;
  rank: number;
}

export interface PassOverlayData {
  title: string;
  subtitle: string;
  nextName: string;
  nextEmoji: string;
}

export interface ToastData {
  id: number;
  message: string;
  type: 'ok' | 'error';
}
