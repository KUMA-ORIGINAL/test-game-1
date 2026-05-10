import type { GameMode } from "./types";

const BEST_SCORE_KEYS: Record<GameMode, string> = {
  classic: "save-in-second-best-classic",
  endless: "save-in-second-best-endless",
};

const LEGACY_BEST_SCORE_KEY = "save-in-second-best-score";
const SOUND_ENABLED_KEY = "save-in-second-sound-enabled";

function readNumber(key: string): number {
  try {
    const value = window.localStorage.getItem(key);
    const parsedValue = value ? Number.parseInt(value, 10) : 0;

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  } catch {
    return 0;
  }
}

export function getBestScore(mode: GameMode): number {
  const score = readNumber(BEST_SCORE_KEYS[mode]);

  if (score === 0 && mode === "classic") {
    return readNumber(LEGACY_BEST_SCORE_KEY);
  }

  return score;
}

export function setBestScore(mode: GameMode, score: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_KEYS[mode], String(score));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function getSoundEnabled(): boolean {
  try {
    return window.localStorage.getItem(SOUND_ENABLED_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setSoundEnabled(value: boolean): void {
  try {
    window.localStorage.setItem(SOUND_ENABLED_KEY, String(value));
  } catch {
    // The game can continue without persisted sound preferences.
  }
}
