// audio.js — tiny WebAudio chimes, no audio files. All sounds are short
// oscillator phrases so the game needs no network and no assets.

let ctx = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function note(freq, at, dur, type, vol) {
  const ac = ensureCtx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol || 0.18, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFind() {
  note(660, 0, 0.16, 'sine', 0.2);
  note(880, 0.09, 0.22, 'sine', 0.2);
  note(1320, 0.18, 0.3, 'triangle', 0.12);
}

export function playHint() {
  note(523, 0, 0.14, 'sine', 0.15);
  note(784, 0.1, 0.2, 'sine', 0.15);
}

export function playWrong() {
  note(180, 0, 0.2, 'sawtooth', 0.08);
  note(140, 0.08, 0.22, 'sawtooth', 0.08);
}

export function playWin() {
  const seq = [523, 659, 784, 1047, 1319];
  seq.forEach((f, i) => note(f, i * 0.12, 0.3, 'triangle', 0.18));
}

export function playLevelComplete() {
  const seq = [523, 659, 784, 1047];
  seq.forEach((f, i) => note(f, i * 0.1, 0.25, 'sine', 0.16));
}

export function playClick() {
  note(440, 0, 0.07, 'sine', 0.08);
}
