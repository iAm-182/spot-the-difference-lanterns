// input.js — mouse click hit-testing and keyboard controls.
// A click on EITHER panel counts: the local (in-panel) coordinates are the
// same on both sides, so one test covers both pictures.

import { panelAt, panelLocalCoords } from './render.js';

export function attachInput(canvas, game, actions) {
  canvas.addEventListener('click', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (ev.clientX - rect.left) * scaleX;
    const y = (ev.clientY - rect.top) * scaleY;
    actions.onClick(x, y);
  });

  window.addEventListener('keydown', (ev) => {
    const k = ev.key.toLowerCase();
    if (k === 'h') actions.onHint();
    else if (k === 'm') actions.onMute();
    else if (k === 'n') actions.onNext();
    else if (k === 'r') actions.onRestart();
    else if (k === 'escape') actions.onMenu();
    else if (k === '1' || k === '2' || k === '3') actions.onLevelSelect(Number(k) - 1);
    else if (k === 'enter' || k === ' ') actions.onConfirm();
  });
}

// findDifferenceAt(game, x, y) — returns the index of the difference under
// the click, or -1. Clicks outside both panels return -1 as well.
export function findDifferenceAt(game, x, y) {
  const panel = panelAt(x, y);
  if (!panel) return -1;
  const local = panelLocalCoords(panel, x, y);
  const diffs = game.level.differences;
  for (let i = 0; i < diffs.length; i++) {
    if (game.found.has(i)) continue;
    const d = diffs[i];
    const dx = local.x - d.x;
    const dy = local.y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return i;
  }
  return -1;
}
