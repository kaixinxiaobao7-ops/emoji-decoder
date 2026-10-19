import { useCallback, useEffect, useRef, useState } from 'react';
import { FinishedScreen } from './components/FinishedScreen';
import { PassOverlay } from './components/PassOverlay';
import { PlayingScreen } from './components/PlayingScreen';
import { RevealScreen } from './components/RevealScreen';
import { StartScreen } from './components/StartScreen';
import { Toast } from './components/Toast';
import { Topbar } from './components/Topbar';
import {
  DEFAULT_NAMES,
  MAX_PLAYERS,
  PLAYER_EMOJIS,
  STORAGE_KEYS,
  TOTAL_ROUNDS,
} from './game/constants';
import { drawQuestions } from './game/game';
import { scoreAnswer } from './game/scoring';
import { playCue, unlockAudio } from './game/sound';
import { readStorage, writeStorage } from './game/storage';
import type {
  BestMoment,
  PassOverlayData,
  Phase,
  Player,
  Question,
  RoundAnswer,
  ToastData,
} from './game/types';

function loadNames(): string[] {
  const raw = readStorage<unknown>(STORAGE_KEYS.names, DEFAULT_NAMES);
  if (!Array.isArray(raw)) return [...DEFAULT_NAMES];

  const names = raw
    .filter((item): item is string => typeof item === 'string')
    .map((name) => name.slice(0, 10))
    .slice(0, MAX_PLAYERS);

  return names.length ? names : [...DEFAULT_NAMES];
}

function loadSound(): boolean {
  return readStorage<boolean>(STORAGE_KEYS.sound, true) !== false;
}

function buildPlayers(names: string[]): Player[] {
  return names.map((name, index) => ({
    id: `player-${index}`,
    name,
    emoji: PLAYER_EMOJIS[index % PLAYER_EMOJIS.length],
  }));
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('start');
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [roundStarter, setRoundStarter] = useState(0);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [bestMoment, setBestMoment] = useState<BestMoment | null>(null);
  const [locked, setLocked] = useState(false);
  const [overlay, setOverlay] = useState<PassOverlayData | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [soundOn, setSoundOn] = useState(loadSound);
  const [lastNames, setLastNames] = useState(loadNames);

  const lockRef = useRef(false);
  const soundRef = useRef(soundOn);
  const actionTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const clearActionTimer = useCallback(() => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
  }, []);

  const scheduleAction = useCallback((action: () => void, delay: number) => {
    clearActionTimer();
    actionTimerRef.current = window.setTimeout(() => {
      actionTimerRef.current = null;
      action();
    }, delay);
  }, [clearActionTimer]);

  const showToast = useCallback((message: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ id: Date.now(), message, type });
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2100);
  }, []);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, round]);

  useEffect(() => () => {
    if (actionTimerRef.current !== null) window.clearTimeout(actionTimerRef.current);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const startWithPlayers = useCallback((nextPlayers: Player[]) => {
    if (!nextPlayers.length) return;

    clearActionTimer();
    const nextQuestions = drawQuestions();
    const nextScores = Object.fromEntries(
      nextPlayers.map((player) => [player.id, 0]),
    );

    setPlayers(nextPlayers);
    setScores(nextScores);
    setQuestions(nextQuestions);
    setRound(0);
    setRoundStarter(0);
    setCurrentPlayerIdx(0);
    setAnswers([]);
    setBestMoment(null);
    setLocked(false);
    setOverlay(null);
    setToast(null);
    lockRef.current = false;

    const names = nextPlayers.map((player) => player.name);
    setLastNames(names);
    writeStorage(STORAGE_KEYS.names, names);

    unlockAudio();
    playCue('start', soundRef.current);
    setPhase('playing');
  }, [clearActionTimer]);

  const handleStart = useCallback((names: string[]) => {
    startWithPlayers(buildPlayers(names));
  }, [startWithPlayers]);

  const handleSubmit = useCallback((text: string) => {
    if (phase !== 'playing' || lockRef.current) return;

    const question = questions[round];
    const player = players[currentPlayerIdx];
    if (!question || !player) return;

    const result = scoreAnswer(question, text);
    const answer: RoundAnswer = {
      playerId: player.id,
      playerName: player.name,
      playerEmoji: player.emoji,
      text,
      score: result.score,
      matched: result.matched,
      fallback: result.fallback,
      tooShort: result.tooShort,
      round,
    };

    lockRef.current = true;
    setLocked(true);
    setAnswers((current) => [...current, answer]);
    setScores((current) => ({
      ...current,
      [player.id]: (current[player.id] ?? 0) + result.score,
    }));
    setBestMoment((current) => (
      !current || result.score > current.score
        ? {
            playerName: player.name,
            playerEmoji: player.emoji,
            text,
            score: result.score,
            round,
          }
        : current
    ));

    playCue('seal', soundRef.current);

    const isLastAnswer = answers.length + 1 >= players.length;
    if (isLastAnswer) {
      setOverlay({
        title: '全员封存完毕',
        subtitle: '开奖之前，谁也不知道会发生什么',
        nextName: '开奖',
        nextEmoji: '🎉',
      });
      scheduleAction(() => {
        setOverlay(null);
        setLocked(false);
        setPhase('revealing');
        playCue('reveal', soundRef.current);
      }, 850);
      return;
    }

    const nextIndex = (currentPlayerIdx + 1) % players.length;
    const nextPlayer = players[nextIndex];
    setOverlay({
      title: '答案已封存',
      subtitle: '下一位，准备接梗',
      nextName: nextPlayer.name,
      nextEmoji: nextPlayer.emoji,
    });
    scheduleAction(() => {
      setOverlay(null);
      setCurrentPlayerIdx(nextIndex);
      setLocked(false);
      lockRef.current = false;
    }, 900);
  }, [answers.length, currentPlayerIdx, phase, players, questions, round, scheduleAction]);

  const handleNextRound = useCallback(() => {
    if (phase !== 'revealing') return;

    if (round >= TOTAL_ROUNDS - 1) {
      setPhase('finished');
      playCue('finish', soundRef.current);
      return;
    }

    const nextRound = round + 1;
    const nextStarter = nextRound % players.length;
    setRound(nextRound);
    setRoundStarter(nextStarter);
    setCurrentPlayerIdx(nextStarter);
    setAnswers([]);
    setLocked(false);
    lockRef.current = false;
    playCue('start', soundRef.current);
    setPhase('playing');
  }, [phase, players.length, round]);

  const handleReplay = useCallback(() => {
    startWithPlayers(players.map((player) => ({ ...player })));
  }, [players, startWithPlayers]);

  const handleNewGame = useCallback(() => {
    clearActionTimer();
    setOverlay(null);
    setLocked(false);
    lockRef.current = false;
    setLastNames(players.map((player) => player.name));
    setAnswers([]);
    setPhase('start');
  }, [clearActionTimer, players]);

  const handleSoundToggle = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    soundRef.current = next;
    writeStorage(STORAGE_KEYS.sound, next);

    if (next) {
      unlockAudio();
      playCue('toggle', true);
      showToast('音效已开启');
    } else {
      showToast('音效已关闭');
    }
  }, [showToast, soundOn]);

  const currentQuestion = questions[round];
  const currentPlayer = players[currentPlayerIdx];

  return (
    <>
      <div className="app">
        <Topbar soundOn={soundOn} onToggleSound={handleSoundToggle} />
        <main>
          {phase === 'start' && (
            <StartScreen initialNames={lastNames} onStart={handleStart} />
          )}

          {phase === 'playing' && currentQuestion && currentPlayer && (
            <PlayingScreen
              round={round}
              question={currentQuestion}
              players={players}
              currentPlayer={currentPlayer}
              roundStarter={roundStarter}
              sealedAnswers={answers}
              locked={locked}
              onSubmit={handleSubmit}
            />
          )}

          {phase === 'revealing' && currentQuestion && (
            <RevealScreen
              round={round}
              question={currentQuestion}
              answers={answers}
              onNext={handleNextRound}
            />
          )}

          {phase === 'finished' && (
            <FinishedScreen
              players={players}
              scores={scores}
              bestMoment={bestMoment}
              onReplay={handleReplay}
              onNewGame={handleNewGame}
              onToast={showToast}
            />
          )}
        </main>
      </div>

      <Toast key={toast?.id ?? 'toast'} toast={toast} />
      <PassOverlay data={overlay} />
    </>
  );
}
