import { useEffect, useState, type CSSProperties } from 'react';
import { TOTAL_ROUNDS } from '../game/constants';
import type { Question, RoundAnswer } from '../game/types';

interface RevealScreenProps {
  round: number;
  question: Question;
  answers: RoundAnswer[];
  onNext: () => void;
}

function answerNote(answer: RoundAnswer) {
  if (answer.tooShort) return <span className="miss">答案太短，未计分</span>;
  if (answer.fallback) return <span className="miss">脑洞清奇 · 参与分</span>;
  if (!answer.matched.length) return <span className="hit">关键词命中</span>;
  return <span className="hit">命中 {answer.matched.join(' · ')}</span>;
}

export function RevealScreen({ round, question, answers, onNext }: RevealScreenProps) {
  const [animate, setAnimate] = useState(false);
  const topScore = answers.length
    ? Math.max(...answers.map((answer) => answer.score))
    : 0;
  const topAnswer = answers.find((answer) => answer.score === topScore);
  const isLastRound = round === TOTAL_ROUNDS - 1;
  const references = Array.from(new Set(question.answers.map((answer) => answer.text))).slice(0, 3);

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimate(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="screen active" data-screen="revealing" aria-labelledby="revealTitle">
      <div className="game-wrap">
        <div className="reveal-head">
          <span className="reveal-emoji" aria-hidden="true">{question.emoji}</span>
          <div className="reveal-head-copy">
            <h2 className="reveal-title" id="revealTitle">第 {round + 1} 题开奖</h2>
            <p className="reveal-sub">
              ROUND {String(round + 1).padStart(2, '0')} · {answers.length} 种脑回路
            </p>
          </div>
        </div>

        <div className="round-top">
          <span aria-hidden="true">🏅</span>
          <span>本轮最高分 <strong>{topAnswer?.playerName ?? '—'}</strong></span>
          <span className="top-score">+{topScore}</span>
        </div>

        <div className="answers-list">
          {answers.map((answer, index) => {
            const winner = answer.score === topScore;
            return (
              <article
                className={`answer-card${winner ? ' winner' : ''}`}
                key={`${answer.playerId}-${answer.round}`}
                style={{ '--i': index } as CSSProperties}
              >
                <div className="answer-head">
                  <span className="answer-avatar" aria-hidden="true">{answer.playerEmoji}</span>
                  <span className="answer-player">{answer.playerName}</span>
                  {winner && <span className="winner-badge">本轮最佳</span>}
                  <span className="answer-score">{answer.score}<small>分</small></span>
                </div>
                <p className="answer-text">“{answer.text}”</p>
                <div className="score-bar">
                  <i
                    style={{
                      width: animate ? `${answer.score}%` : 0,
                      '--i': index,
                    } as CSSProperties}
                  />
                </div>
                <p className="answer-note">{answerNote(answer)}</p>
              </article>
            );
          })}
        </div>

        <div className="reference-card">
          <p className="reference-label">REFERENCE · 参考答案</p>
          <ul className="ref-list">
            {references.map((reference, index) => (
              <li key={reference}>
                <span>0{index + 1}</span> {reference}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal-actions">
          <button className="btn btn-primary" id="nextBtn" type="button" onClick={onNext}>
            {isLastRound ? (
              <>
                <span>看看谁是梗王</span>
                <span className="arrow" aria-hidden="true">👑</span>
              </>
            ) : (
              <>
                <span>下一题 · 第 {round + 2} 题</span>
                <span className="arrow" aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
        <p className="score-tease">总分将在最后一题揭晓 · 先别急着庆祝</p>
      </div>
    </section>
  );
}
