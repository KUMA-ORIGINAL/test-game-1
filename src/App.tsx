import { useCallback, useEffect, useRef, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { HowToPlayScreen } from "./components/HowToPlayScreen";
import { KumaBackground } from "./components/KumaBackground";
import { MenuScreen } from "./components/MenuScreen";
import { ResultScreen } from "./components/ResultScreen";
import { levels } from "./game/levels";
import {
  getBestScore,
  getSoundEnabled,
  setBestScore as saveBestScore,
  setSoundEnabled as saveSoundEnabled,
} from "./game/storage";
import { playClickSound } from "./game/sound";
import { vibrateClick } from "./game/haptics";
import type { GameLevel, GameMode, GameStatus } from "./game/types";

const RESULT_DELAY_MS = 850;
const KUMA_EVENT_LEVEL_ID = 10;
const KUMA_EVENT_DELAY_MS = 2600;
const MIN_ENDLESS_TIME_MS = 800;
const ENDLESS_TIME_STEP_MS = 80;

function pickRandomLevel(): GameLevel {
  return levels[Math.floor(Math.random() * levels.length)] ?? levels[0];
}

function getRoundTimeLimitMs(
  level: GameLevel,
  mode: GameMode,
  score: number,
): number {
  if (mode === "classic") {
    return level.timeLimitMs;
  }

  return Math.max(MIN_ENDLESS_TIME_MS, level.timeLimitMs - score * ENDLESS_TIME_STEP_MS);
}

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("menu");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(levels[0]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundId, setRoundId] = useState(0);
  const [activeTimeLimitMs, setActiveTimeLimitMs] = useState(levels[0].timeLimitMs);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboMessage, setComboMessage] = useState("");
  const [bestScores, setBestScores] = useState<Record<GameMode, number>>(() => ({
    classic: getBestScore("classic"),
    endless: getBestScore("endless"),
  }));
  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled());
  const [isNewRecord, setIsNewRecord] = useState(false);
  const delayRef = useRef<number | null>(null);
  const roundLockedRef = useRef(false);

  const clearDelay = useCallback(() => {
    if (delayRef.current !== null) {
      window.clearTimeout(delayRef.current);
      delayRef.current = null;
    }
  }, []);

  const playUiClickFeedback = useCallback(() => {
    if (soundEnabled) {
      playClickSound();
    }

    vibrateClick();
  }, [soundEnabled]);

  useEffect(() => {
    return () => {
      clearDelay();
    };
  }, [clearDelay]);

  const finishGame = useCallback(
    (finalScore: number, mode: GameMode) => {
      const hasNewRecord = finalScore > bestScores[mode];

      if (hasNewRecord) {
        saveBestScore(mode, finalScore);
        setBestScores((scores) => ({
          ...scores,
          [mode]: finalScore,
        }));
      }

      roundLockedRef.current = true;
      setIsNewRecord(hasNewRecord);
      setGameStatus("gameOver");
    },
    [bestScores],
  );

  const startGame = useCallback(
    (mode: GameMode) => {
      playUiClickFeedback();
      clearDelay();

      const firstLevel = mode === "classic" ? levels[0] : pickRandomLevel();

      roundLockedRef.current = false;
      setGameMode(mode);
      setCurrentLevel(firstLevel);
      setCurrentLevelIndex(0);
      setRoundNumber(1);
      setRoundId((id) => id + 1);
      setActiveTimeLimitMs(getRoundTimeLimitMs(firstLevel, mode, 0));
      setScore(0);
      setCombo(0);
      setComboMessage("");
      setIsNewRecord(false);
      setGameStatus("playing");
    },
    [clearDelay, playUiClickFeedback],
  );

  const restartGame = useCallback(() => {
    startGame(gameMode);
  }, [gameMode, startGame]);

  const returnToMenu = useCallback(() => {
    playUiClickFeedback();
    clearDelay();
    roundLockedRef.current = true;
    setComboMessage("");
    setGameStatus("menu");
  }, [clearDelay, playUiClickFeedback]);

  const showHowToPlay = useCallback(() => {
    playUiClickFeedback();
    setGameStatus("howToPlay");
  }, [playUiClickFeedback]);

  const toggleSound = useCallback(() => {
    playClickSound();
    vibrateClick();
    setSoundEnabledState((currentValue) => {
      const nextValue = !currentValue;
      saveSoundEnabled(nextValue);
      return nextValue;
    });
  }, []);

  const pauseGame = useCallback(() => {
    if (gameStatus !== "playing") {
      return;
    }

    playUiClickFeedback();
    setGameStatus("paused");
  }, [gameStatus, playUiClickFeedback]);

  const resumeGame = useCallback(() => {
    if (gameStatus !== "paused") {
      return;
    }

    playUiClickFeedback();
    setGameStatus("playing");
  }, [gameStatus, playUiClickFeedback]);

  const continueWithLevel = useCallback(
    (nextLevel: GameLevel, nextIndex: number, nextRoundNumber: number, nextScore: number) => {
      setCurrentLevel(nextLevel);
      setCurrentLevelIndex(nextIndex);
      setRoundNumber(nextRoundNumber);
      setRoundId((id) => id + 1);
      setActiveTimeLimitMs(getRoundTimeLimitMs(nextLevel, gameMode, nextScore));
      setComboMessage("");
      roundLockedRef.current = false;
      setGameStatus("playing");
    },
    [gameMode],
  );

  const handleSuccess = useCallback(() => {
    if (gameStatus !== "playing" || roundLockedRef.current) {
      return;
    }

    clearDelay();
    roundLockedRef.current = true;

    const nextScore = score + 1;
    const nextCombo = combo + 1;
    const nextComboMessage =
      gameMode === "endless" && nextCombo % 5 === 0 ? `Серия x${nextCombo}!` : "";

    setScore(nextScore);
    setCombo(nextCombo);
    setComboMessage(nextComboMessage);
    setGameStatus("success");

    const successDelayMs =
      currentLevel.id === KUMA_EVENT_LEVEL_ID ? KUMA_EVENT_DELAY_MS : RESULT_DELAY_MS;

    delayRef.current = window.setTimeout(() => {
      if (gameMode === "classic") {
        const isLastLevel = currentLevelIndex >= levels.length - 1;

        if (isLastLevel) {
          finishGame(nextScore, gameMode);
          return;
        }

        const nextIndex = currentLevelIndex + 1;
        continueWithLevel(levels[nextIndex], nextIndex, nextIndex + 1, nextScore);
        return;
      }

      continueWithLevel(pickRandomLevel(), currentLevelIndex + 1, nextScore + 1, nextScore);
    }, successDelayMs);
  }, [
    clearDelay,
    combo,
    continueWithLevel,
    currentLevel.id,
    currentLevelIndex,
    finishGame,
    gameMode,
    gameStatus,
    score,
  ]);

  const handleFail = useCallback(() => {
    if (gameStatus !== "playing" || roundLockedRef.current) {
      return;
    }

    clearDelay();
    roundLockedRef.current = true;
    setGameStatus("fail");

    delayRef.current = window.setTimeout(() => {
      finishGame(score, gameMode);
    }, RESULT_DELAY_MS);
  }, [clearDelay, finishGame, gameMode, gameStatus, score]);

  if (gameStatus === "menu") {
    return (
      <>
        <KumaBackground />
        <MenuScreen
          bestScores={bestScores}
          soundEnabled={soundEnabled}
          onStart={startGame}
          onHowToPlay={showHowToPlay}
          onToggleSound={toggleSound}
        />
      </>
    );
  }

  if (gameStatus === "howToPlay") {
    return (
      <>
        <KumaBackground />
        <HowToPlayScreen onBack={returnToMenu} />
      </>
    );
  }

  if (gameStatus === "gameOver") {
    return (
      <>
        <KumaBackground />
        <ResultScreen
          mode={gameMode}
          score={score}
          bestScore={bestScores[gameMode]}
          isNewRecord={isNewRecord}
          onRestart={restartGame}
          onMenu={returnToMenu}
        />
      </>
    );
  }

  return (
    <>
      <KumaBackground />
      <GameScreen
        level={currentLevel}
        roundId={roundId}
        levelNumber={gameMode === "classic" ? currentLevelIndex + 1 : roundNumber}
        totalLevels={levels.length}
        score={score}
        combo={combo}
        comboMessage={comboMessage}
        mode={gameMode}
        status={gameStatus}
        timeLimitMs={activeTimeLimitMs}
        soundEnabled={soundEnabled}
        onSuccess={handleSuccess}
        onFail={handleFail}
        onPause={pauseGame}
        onResume={resumeGame}
        onMenu={returnToMenu}
        onToggleSound={toggleSound}
      />
    </>
  );
}

export default App;
