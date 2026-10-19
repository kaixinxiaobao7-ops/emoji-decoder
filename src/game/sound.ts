type SoundCue = 'start' | 'seal' | 'reveal' | 'finish' | 'error' | 'toggle';

let audioContext: AudioContext | null = null;

function ensureAudio(): AudioContext | null {
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioContext) audioContext = new AudioCtor();
    if (audioContext.state === 'suspended') void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

export function unlockAudio(): void {
  ensureAudio();
}

function tone(
  frequency: number,
  duration = 0.08,
  delay = 0,
  type: OscillatorType = 'sine',
  volume = 0.035,
): void {
  const context = ensureAudio();
  if (!context) return;

  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playCue(cue: SoundCue, enabled: boolean): void {
  if (!enabled) return;

  if (cue === 'seal') {
    tone(440, 0.06, 0, 'triangle', 0.03);
    tone(660, 0.08, 0.06, 'triangle', 0.025);
    return;
  }
  if (cue === 'start' || cue === 'reveal') {
    tone(523.25, 0.08, 0, 'sine', 0.03);
    tone(659.25, 0.09, 0.08, 'sine', 0.03);
    tone(783.99, 0.12, 0.17, 'sine', 0.035);
    return;
  }
  if (cue === 'finish') {
    tone(523.25, 0.1, 0, 'triangle', 0.035);
    tone(659.25, 0.1, 0.1, 'triangle', 0.035);
    tone(783.99, 0.12, 0.21, 'triangle', 0.04);
    tone(1046.5, 0.22, 0.34, 'triangle', 0.04);
    return;
  }
  if (cue === 'toggle') {
    tone(660, 0.08, 0, 'sine', 0.03);
    return;
  }
  tone(180, 0.1, 0, 'square', 0.02);
}
