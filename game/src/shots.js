// shots.js — demo states for screenshots (?shot=...). These only set the
// game state on load; they never change how the game plays.
//   ?shot=start   title screen
//   ?shot=cover   level 1 mid-game, exactly 3 of 7 found
//   ?shot=harbor  level 2, 2 of 8 found
//   ?shot=win     victory screen with three stars

export function applyShot(game, params) {
  const shot = params.get('shot');
  if (!shot) return false;
  if (shot === 'start') {
    game.state = 'menu';
    game.levelIndex = 0;
    game.resetLevel(0);
    return true;
  }
  if (shot === 'cover') {
    game.levelIndex = 0;
    game.resetLevel(0);
    game.state = 'playing';
    game.found = new Set([0, 3, 5]);
    game.score = 300;
    game.timeLeft = 142;
    game.hintsLeft = 2;
    return true;
  }
  if (shot === 'harbor') {
    game.levelIndex = 1;
    game.resetLevel(1);
    game.state = 'playing';
    game.found = new Set([1, 4]);
    game.score = 940;
    game.timeLeft = 111;
    game.hintsLeft = 3;
    return true;
  }
  if (shot === 'win') {
    game.levelIndex = 2;
    game.resetLevel(2);
    game.state = 'victory';
    game.found = new Set(game.level.differences.map((_, i) => i));
    game.score = 2840;
    game.timeLeft = 0;
    game.stars = 3;
    return true;
  }
  return false;
}
