import type { Difficulty } from './types';

export const TOTAL_ROUNDS = 8;
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 1;

export const PLAYER_EMOJIS = ['🐣', '🐸', '🦊', '🐼', '🐯', '🐙'] as const;

export const LEVEL_NAMES: Record<Difficulty, string> = {
  1: 'LEVEL 01',
  2: 'LEVEL 02',
  3: 'LEVEL 03',
};

export const STORAGE_KEYS = {
  names: 'meme-decoder-names',
  sound: 'meme-decoder-sound',
} as const;

export const DEFAULT_NAMES = ['阿伟', '小美', '大聪明'];
