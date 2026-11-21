// main.js — bootstrap + game state machine for Lantern Festival.
// States: menu / playing / level-complete / victory / game-over.
// Owns the clock, the score, hints and level flow; render.js paints it,
// input.js feeds it clicks and keys, audio.js sounds it, scenes.js draws it.

import { LEVELS } from './scenes.js';
import {
  CANVAS,
  drawHud,
  drawPanels,
  drawMenu,
  drawLevelComplete,
  drawVictory,
  drawGameOver,
  syncDomHud,
} from './render.js';
import { attachInput, findDifferenceAt } from './input.js';
import {
  playFind,
  playHint,
  playWrong,
  playWin,
  playLevelComplete,
  playClick,
  setMuted,
  isMuted,
} from './audio.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

export const game = {
  state: 'menu',
  levelIndex: 0,
  level: LEVELS[0],
  found: new Set(),
  score: 0,
  timeLeft: LEVELS[0].timeLimit,
  hintsLeft: 3,
  hint: null,
  wrong: null,
  stars: 0,
  levelBonus: 0,

  resetLevel(index) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = new Set();
    this.timeLeft = this.level.timeLimit;
    this.hintsLeft = 3;
    this.hint = null;
    this.wrong = null;
    this.levelBonus = 0;
  },

  startLevel(index) {
    this.resetLevel(index);
    this.state = 'playing';
  },

  computeStars() {
    // 3 stars: finished every level with time to spare on the last one.
    if (this.score >= 2500) return 3;
    if (this.score >= 1800) return 2;
    return 1;
  },
};

function awardLevelBonus() {
  const bonus = Math.ceil(game.timeLeft) * 5;
  game.levelBonus = bonus;
  game.score += bonus;
}

function onClick(x, y) {
  if (game.state === 'menu') {
    playClick();
    game.startLevel(game.levelIndex);
    return;
  }
  if (game.state === 'level-complete') {
    playClick();
    if (game.levelIndex < LEVELS.length - 1) game.startLevel(game.levelIndex + 1);
    else {
      game.stars = game.computeStars();
      game.state = 'victory';
      playWin();
    }
    return;
  }
  if (game.state === 'victory' || game.state === 'game-over') return;
  if (game.state !== 'playing') return;

  const idx = findDifferenceAt(game, x, y);
  if (idx >= 0) {
    game.found.add(idx);
    game.score += 100;
    playFind();
    if (game.found.size === game.level.differences.length) {
      awardLevelBonus();
      game.state = 'level-complete';
      playLevelComplete();
    }
  } else {
    game.wrong = { x, y, at: performance.now() };
    game.timeLeft = Math.max(0, game.timeLeft - 5);
    game.score = Math.max(0, game.score - 10);
    playWrong();
  }
}

function onHint() {
  if (game.state !== 'playing') return;
  if (game.hintsLeft <= 0) return;
  const remaining = game.level.differences
    .map((_, i) => i)
    .filter((i) => !game.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hint = { index: pick, at: performance.now() };
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - 50);
  playHint();
}

function onMute() {
  setMuted(!isMuted());
}

function onNext() {
  if (game.state === 'level-complete') {
    if (game.levelIndex < LEVELS.length - 1) game.startLevel(game.levelIndex + 1);
    else {
      game.stars = game.computeStars();
      game.state = 'victory';
      playWin();
    }
  } else if (game.state === 'playing' || game.state === 'game-over') {
    game.startLevel((game.levelIndex + 1) % LEVELS.length);
  }
}

function onRestart() {
  game.startLevel(game.levelIndex);
}

function onMenu() {
  game.state = 'menu';
  game.resetLevel(0);
}

function onLevelSelect(index) {
  if (game.state === 'menu') {
    game.levelIndex = index;
    game.startLevel(index);
  }
}

function onConfirm() {
  if (game.state === 'menu') game.startLevel(game.levelIndex);
  else if (game.state === 'level-complete') onNext();
}

attachInput(canvas, game, {
  onClick,
  onHint,
  onMute,
  onNext,
  onRestart,
  onMenu,
  onLevelSelect,
  onConfirm,
});

// Demo shot states (?shot=cover etc.) only set state on load.
const shotApplied = applyShot(game, new URLSearchParams(window.location.search));

let lastTick = performance.now();

function frame(now) {
  const dt = Math.min(0.25, (now - lastTick) / 1000);
  lastTick = now;

  if (game.state === 'playing') {
    game.timeLeft -= dt;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.state = 'game-over';
      playWrong();
    }
  }

  ctx.clearRect(0, 0, CANVAS.w, CANVAS.h);
  if (game.state === 'menu') drawMenu(ctx, game);
  else if (game.state === 'playing') {
    drawHud(ctx, game);
    drawPanels(ctx, game, now);
  } else if (game.state === 'level-complete') drawLevelComplete(ctx, game);
  else if (game.state === 'victory') drawVictory(ctx, game);
  else if (game.state === 'game-over') drawGameOver(ctx, game);

  syncDomHud(game);
  requestAnimationFrame(frame);
}

if (!shotApplied) {
  game.state = 'menu';
  game.resetLevel(0);
}
requestAnimationFrame(frame);
