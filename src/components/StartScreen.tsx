import { useRef, useState } from 'react';
import {
  DEFAULT_NAMES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_EMOJIS,
  TOTAL_ROUNDS,
} from '../game/constants';

interface StartScreenProps {
  initialNames: string[];
  onStart: (names: string[]) => void;
}

export function StartScreen({ initialNames, onStart }: StartScreenProps) {
  const [names, setNames] = useState<string[]>(() => {
    const seed = initialNames.length ? initialNames : DEFAULT_NAMES;
    return seed.slice(0, MAX_PLAYERS);
  });
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const addPlayer = () => {
    if (names.length >= MAX_PLAYERS) return;
    setNames((current) => [...current, '']);
    setError('');
    window.requestAnimationFrame(() => {
      const inputs = listRef.current?.querySelectorAll<HTMLInputElement>('.name-input');
      inputs?.[names.length]?.focus();
    });
  };

  const removePlayer = (index: number) => {
    if (names.length <= MIN_PLAYERS) return;
    setNames((current) => current.filter((_, playerIndex) => playerIndex !== index));
    setError('');
  };

  const updateName = (index: number, value: string) => {
    setNames((current) => current.map((name, playerIndex) => (
      playerIndex === index ? value : name
    )));
    setError('');
  };

  const handleStart = () => {
    const cleaned = names.map((name, index) => name.trim() || `玩家 ${index + 1}`);
    if (cleaned.length < MIN_PLAYERS) {
      setError('至少需要一位玩家才能开局。');
      return;
    }
    if (new Set(cleaned).size !== cleaned.length) {
      setError('昵称不能重复，给每个人起个不一样的名字吧。');
      return;
    }
    setError('');
    onStart(cleaned);
  };

  return (
    <section className="screen active" data-screen="start" aria-labelledby="startTitle">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="spark">✦</span> 看 emoji · 说人话 · 当梗王
          </div>
          <h1 id="startTitle">
            同一个 emoji
            <br />
            <span className="marker">不同的脑回路</span>
          </h1>
          <p className="lede">
            轮流看一串 emoji，用一句话说出你的解读。系统按关键词判分——
            <strong>沾边就有分，精准才封神</strong>。看看这局谁最懂梗。
          </p>
          <div className="emoji-parade" aria-hidden="true">
            <span className="emoji-chip">🐱🌧️💔</span>
            <span className="emoji-chip">🕳️🐭🎂</span>
            <span className="emoji-chip">😭😂😭</span>
          </div>
          <div className="hero-note">
            <b>3</b> 步开玩 · 无需登录 · 手机也能玩
          </div>
        </div>

        <div className="setup-card">
          <div className="setup-head">
            <div>
              <p className="card-kicker">SET THE PARTY</p>
              <h2>拉人入伙</h2>
            </div>
            <span className="step-pill">本局 {TOTAL_ROUNDS} 题</span>
          </div>

          <div className="player-list" ref={listRef}>
            {names.map((name, index) => (
              <div className="player-row" key={`player-${index}`}>
                <span className="player-avatar" aria-hidden="true">
                  {PLAYER_EMOJIS[index % PLAYER_EMOJIS.length]}
                </span>
                <input
                  className="name-input"
                  type="text"
                  maxLength={10}
                  value={name}
                  placeholder={`玩家 ${index + 1}`}
                  aria-label={`玩家 ${index + 1} 昵称`}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => updateName(index, event.target.value)}
                />
                <button
                  className="remove-player"
                  type="button"
                  data-remove={index}
                  aria-label={`移除玩家 ${index + 1}`}
                  title="移除"
                  disabled={names.length <= MIN_PLAYERS}
                  onClick={() => removePlayer(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="setup-tools">
            <button
              className="add-player"
              id="addPlayerBtn"
              type="button"
              disabled={names.length >= MAX_PLAYERS}
              onClick={addPlayer}
            >
              {names.length >= MAX_PLAYERS ? '已满 6 人' : '＋ 再加一位'}
            </button>
            <span className="player-limit">{names.length} / {MAX_PLAYERS} 人同屏</span>
          </div>

          <p className={`error-line${error ? ' show' : ''}`} role="alert">
            {error}
          </p>
          <button className="btn btn-primary" id="startBtn" type="button" onClick={handleStart}>
            <span>开始接梗</span>
            <span className="arrow" aria-hidden="true">→</span>
          </button>
          <p className="start-note">轮流作答 · 答案即时封存 · 单人也能先试玩</p>
        </div>
      </div>

      <div className="how-strip" aria-label="玩法说明">
        <div className="how-item">
          <span className="how-num">01</span>
          <div>
            <strong>看 emoji</strong>
            <p>一串神秘表情，信息量全靠脑补。</p>
          </div>
        </div>
        <div className="how-item">
          <span className="how-num">02</span>
          <div>
            <strong>一句话开脑洞</strong>
            <p>按顺序轮流输入，提交即封存，不给后面的人抄。</p>
          </div>
        </div>
        <div className="how-item">
          <span className="how-num">03</span>
          <div>
            <strong>开奖比懂梗</strong>
            <p>关键词命中越多分越高，8 题后诞生本局梗王。</p>
          </div>
        </div>
      </div>
      <p className="page-foot">NO SERVER · NO LOGIN · JUST VIBES</p>
    </section>
  );
}
