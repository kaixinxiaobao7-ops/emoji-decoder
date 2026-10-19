import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { LEVEL_NAMES, TOTAL_ROUNDS } from '../game/constants';
import { normalizeText } from '../game/scoring';
import type { Player, Question, RoundAnswer } from '../game/types';

interface PlayingScreenProps {
  round: number;
  question: Question;
  players: Player[];
  currentPlayer: Player;
  roundStarter: number;
  sealedAnswers: RoundAnswer[];
  locked: boolean;
  onSubmit: (text: string) => void;
}

const PLACEHOLDERS = [
  '比如：猫在雨里失恋了…',
  '一句话说出你的脑回路…',
  '别想太久，第一反应最真实…',
  '这里可以大胆开脑洞…',
];

export function PlayingScreen({
  round,
  question,
  players,
  currentPlayer,
  roundStarter,
  sealedAnswers,
  locked,
  onSubmit,
}: PlayingScreenProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer('');
    setError('');
    if (locked || !window.matchMedia('(pointer: fine)').matches) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [round, currentPlayer.id, locked]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked) return;

    const text = answer.trim();
    if (!text) {
      setError('先写点什么再封存吧，哪怕只是一句吐槽。');
      return;
    }
    if (normalizeText(text).length < 2) {
      setError('太短啦！至少写 2 个字，判分才能看懂你的梗。');
      return;
    }

    setError('');
    setAnswer('');
    onSubmit(text);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      if (event.key === 'Enter') event.preventDefault();
      return;
    }
    if (event.key === 'Escape') {
      setAnswer('');
      setError('');
    }
  };

  const sealedIds = new Set(sealedAnswers.map((item) => item.playerId));
  const orderedPlayers = players.map(
    (_, offset) => players[(roundStarter + offset) % players.length],
  );
  const placeholder = PLACEHOLDERS[round % PLACEHOLDERS.length];

  return (
    <section className="screen active" data-screen="playing" aria-labelledby="playTitle">
      <div className="game-wrap">
        <div className="round-head">
          <div>
            <p className="round-kicker">MAKE IT MAKE SENSE</p>
            <h2 className="round-title" id="playTitle">
              第 <b>{round + 1}</b> 题 / {TOTAL_ROUNDS}
            </h2>
          </div>
          <span className="round-count">ROUND {String(round + 1).padStart(2, '0')}</span>
        </div>

        <div className="round-track" aria-hidden="true">
          {Array.from({ length: TOTAL_ROUNDS }, (_, index) => (
            <span
              key={index}
              className={index < round ? 'done' : index === round ? 'now' : ''}
            />
          ))}
        </div>

        <div className="emoji-stage">
          <div className="stage-tape" aria-hidden="true" />
          <div className="stage-top">
            <span className="stage-tag">{question.tag}</span>
            <span className="stage-mini">{LEVEL_NAMES[question.level]}</span>
          </div>
          <div className="emoji-big" aria-label={`Emoji 题目：${question.emoji}`}>
            {question.emoji}
          </div>
          <p className="prompt">
            这串 emoji 让你想到什么？
            <small>用一句话描述，判分很宽容，沾边就有分</small>
          </p>
        </div>

        <div className="turn-card">
          <span className="turn-avatar" aria-hidden="true">
            {currentPlayer.emoji}
          </span>
          <div className="turn-copy">
            <span className="turn-label">NOW PLAYING</span>
            <span className="turn-name" aria-live="polite">{currentPlayer.name}</span>
          </div>
          <span className="turn-order">
            {sealedAnswers.length + 1} / {players.length} 位
          </span>
        </div>

        <div className="status-row" aria-label="作答进度">
          {orderedPlayers.map((player) => {
            const isDone = sealedIds.has(player.id);
            const isCurrent = !isDone && player.id === currentPlayer.id;
            const status = isDone ? '已封存' : isCurrent ? '作答中' : '等待中';
            return (
              <span
                className={`status-chip${isDone ? ' done' : isCurrent ? ' current' : ''}`}
                key={player.id}
              >
                <span className="mini-avatar" aria-hidden="true">
                  {isDone ? '✓' : player.emoji}
                </span>
                <span className="chip-name">{player.name}</span>
                <span className="sr-only">{status}</span>
              </span>
            );
          })}
        </div>

        <form className="answer-form" id="answerForm" noValidate onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="answerInput">输入你的答案</label>
          <p className={`form-error${error ? ' show' : ''}`} role="alert">
            {error}
          </p>
          <input
            className="answer-input"
            id="answerInput"
            ref={inputRef}
            type="text"
            maxLength={30}
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={placeholder}
            value={answer}
            disabled={locked}
            onChange={(event) => {
              setAnswer(event.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="input-meta">
            <span>至少 2 个字 · Enter 提交</span>
            <span className="count">{answer.length} / 30</span>
          </div>
          <button className="btn-submit" id="submitBtn" type="submit" disabled={locked}>
            {locked ? '已封存 ✓' : '封存答案 🔒'}
          </button>
        </form>
        <p className="play-foot">✦ 答案在开奖前不会公开，放心大胆开脑洞</p>
      </div>
    </section>
  );
}
