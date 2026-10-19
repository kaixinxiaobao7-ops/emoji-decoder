import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { TOTAL_ROUNDS } from '../game/constants';
import { getRanking } from '../game/game';
import { drawShareCard } from '../game/shareCard';
import type { BestMoment, Player } from '../game/types';

interface FinishedScreenProps {
  players: Player[];
  scores: Record<string, number>;
  bestMoment: BestMoment | null;
  onReplay: () => void;
  onNewGame: () => void;
  onToast: (message: string, type?: 'ok' | 'error') => void;
}

type ConfettiStyle = CSSProperties & {
  '--dur': string;
  '--delay': string;
  '--x': string;
  '--r': string;
};

const CONFETTI_COLORS = ['#FFD400', '#FF8EAE', '#8FF0C1', '#9BDCFF', '#FFF8E7'];

function makeConfetti(): ConfettiStyle[] {
  return Array.from({ length: 34 }, (_, index) => ({
    left: `${Math.random() * 100}%`,
    width: `${5 + Math.random() * 6}px`,
    height: `${8 + Math.random() * 8}px`,
    background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    '--dur': `${1.8 + Math.random() * 1.8}s`,
    '--delay': `${Math.random() * 0.6}s`,
    '--x': `${Math.random() * 160 - 80}px`,
    '--r': `${Math.random() * 720 - 360}deg`,
  }));
}

export function FinishedScreen({
  players,
  scores,
  bestMoment,
  onReplay,
  onNewGame,
  onToast,
}: FinishedScreenProps) {
  const ranking = useMemo(() => getRanking(players, scores), [players, scores]);
  const confetti = useMemo(makeConfetti, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const topScore = ranking[0]?.score ?? 0;
  const champions = ranking.filter((player) => player.score === topScore);
  const championNames = champions.map((player) => player.name);
  const championLabel = championNames.length > 2
    ? `${championNames[0]} 等 ${championNames.length} 人`
    : championNames.join(' & ');
  const maxScore = Math.max(topScore, 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      drawShareCard(canvas, {
        ranking,
        bestMoment,
        totalRounds: TOTAL_ROUNDS,
        playerCount: players.length,
      });
    };

    draw();
    document.fonts?.ready.then(draw).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [bestMoment, players.length, ranking]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `梗语者战报_${stamp}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      onToast('战报已保存，去群里炫耀吧');
    } catch {
      onToast('当前浏览器不支持保存，试试长按图片', 'error');
    }
  };

  return (
    <section className="screen active" data-screen="finished" aria-labelledby="finishTitle">
      <div className="game-wrap">
        <div className="finish-hero">
          <div className="confetti-layer" aria-hidden="true">
            {confetti.map((style, index) => (
              <span className="confetti" key={index} style={style} />
            ))}
          </div>
          <div className="finish-kicker">GAME OVER · 本局梗王</div>
          <div className="crown" aria-hidden="true">👑</div>
          <h2 className="finish-name" id="finishTitle">{championLabel}</h2>
          <div className="finish-total">
            <span>{topScore}</span><small>分</small>
          </div>
          <p className="finish-meta">
            {TOTAL_ROUNDS} 题 · {players.length} 位玩家 · {
              champions.length > 1 ? `${champions.length} 位并列梗王` : '梗力全开'
            }
          </p>
        </div>

        <div className="rank-card">
          <div className="section-head">
            <h3>最终排名</h3>
            <span>{players.length} PLAYERS</span>
          </div>
          <div>
            {ranking.map((player) => {
              const medal = player.rank === 1
                ? '🥇'
                : player.rank === 2
                  ? '🥈'
                  : player.rank === 3
                    ? '🥉'
                    : String(player.rank).padStart(2, '0');
              const isChampion = player.score === topScore;
              return (
                <div className="rank-row" key={player.id}>
                  <span className="rank-medal" aria-hidden="true">{medal}</span>
                  <div className="rank-main">
                    <div className="rank-line">
                      <span className="rank-avatar" aria-hidden="true">{player.emoji}</span>
                      <span className="rank-name">{player.name}</span>
                      {isChampion && <span className="rank-tag">梗王</span>}
                    </div>
                    <div className="rank-bar">
                      <i
                        style={{
                          width: `${Math.max(4, Math.round((player.score / maxScore) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="rank-score">{player.score}<small>分</small></span>
                </div>
              );
            })}
          </div>
        </div>

        {bestMoment && (
          <div className="best-card">
            <span className="best-icon" aria-hidden="true">⚡</span>
            <div className="best-copy">
              <p className="best-label">BEST MOMENT · 神来一笔</p>
              <p className="best-quote">“{bestMoment.text}”</p>
              <p className="best-meta">
                {bestMoment.playerName} · 第 {bestMoment.round + 1} 题 · {bestMoment.score} 分
              </p>
            </div>
          </div>
        )}

        <div className="share-section">
          <div className="section-head">
            <h3>战报卡片</h3>
            <span>SAVE & SHARE</span>
          </div>
          <div className="canvas-wrap">
            <canvas
              id="shareCanvas"
              ref={canvasRef}
              width={1200}
              height={800}
              role="img"
              aria-label="本局战报图片"
            />
          </div>
          <div className="share-actions">
            <span className="share-tip">手机可长按图片保存<br />发到群里，让大家评评理</span>
            <button className="btn-download" id="downloadBtn" type="button" onClick={downloadCard}>
              ↓ 保存战报
            </button>
          </div>
        </div>

        <div className="finish-actions">
          <button className="btn btn-primary" id="replayBtn" type="button" onClick={onReplay}>
            <span>再来一局</span>
            <span className="arrow" aria-hidden="true">↻</span>
          </button>
          <button className="btn btn-ghost" id="newGameBtn" type="button" onClick={onNewGame}>
            换人重开
          </button>
        </div>
        <p className="replay-note">原班人马再来一局，会重新抽 8 道题</p>
      </div>
    </section>
  );
}
