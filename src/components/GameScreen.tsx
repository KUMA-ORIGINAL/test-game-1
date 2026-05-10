import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { ActiveGameStatus, GameLevel, GameMode, RoundStatus } from "../game/types";
import { playClickSound, playFailSound, playSuccessSound } from "../game/sound";
import { vibrateClick, vibrateFail, vibrateSuccess } from "../game/haptics";
import { SceneRenderer } from "./SceneRenderer";
import { SoundToggle } from "./SoundToggle";
import { TimerBar } from "./TimerBar";

const DEBUG_TARGET = false;

const MODE_LABELS: Record<GameMode, string> = {
  classic: "Классика",
  endless: "Бесконечный режим",
};

type GameScreenProps = {
  level: GameLevel;
  roundId: number;
  levelNumber: number;
  totalLevels: number;
  score: number;
  combo: number;
  comboMessage: string;
  mode: GameMode;
  status: ActiveGameStatus;
  timeLimitMs: number;
  soundEnabled: boolean;
  onSuccess: () => void;
  onFail: () => void;
  onPause: () => void;
  onResume: () => void;
  onMenu: () => void;
  onToggleSound: () => void;
};

export function GameScreen({
  level,
  roundId,
  levelNumber,
  totalLevels,
  score,
  combo,
  comboMessage,
  mode,
  status,
  timeLimitMs,
  soundEnabled,
  onSuccess,
  onFail,
  onPause,
  onResume,
  onMenu,
  onToggleSound,
}: GameScreenProps) {
  const [remainingMs, setRemainingMs] = useState(timeLimitMs);
  const remainingRef = useRef(timeLimitMs);
  const resolvedRef = useRef(false);

  const playClickFeedback = useCallback(() => {
    if (soundEnabled) {
      playClickSound();
    }

    vibrateClick();
  }, [soundEnabled]);

  const playSuccessFeedback = useCallback(() => {
    if (soundEnabled) {
      playSuccessSound();
    }

    vibrateSuccess();
  }, [soundEnabled]);

  const playFailFeedback = useCallback(() => {
    if (soundEnabled) {
      playFailSound();
    }

    vibrateFail();
  }, [soundEnabled]);

  useEffect(() => {
    remainingRef.current = timeLimitMs;
    setRemainingMs(timeLimitMs);
    resolvedRef.current = false;
  }, [level.id, roundId, timeLimitMs]);

  useEffect(() => {
    if (status !== "playing") {
      return undefined;
    }

    const startedAt = performance.now();
    const startingRemainingMs = remainingRef.current;
    let frameId = 0;

    const updateTimer = (now: number) => {
      const elapsedMs = now - startedAt;
      const nextRemainingMs = Math.max(0, startingRemainingMs - elapsedMs);

      remainingRef.current = nextRemainingMs;
      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs <= 0) {
        if (!resolvedRef.current) {
          resolvedRef.current = true;
          playFailFeedback();
          onFail();
        }

        return;
      }

      frameId = requestAnimationFrame(updateTimer);
    };

    frameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [level.id, onFail, playFailFeedback, roundId, status]);

  const handleAreaClick = (event: MouseEvent<HTMLDivElement>) => {
    if (status !== "playing" || resolvedRef.current) {
      return;
    }

    resolvedRef.current = true;
    playClickFeedback();

    const bounds = event.currentTarget.getBoundingClientRect();
    const clickX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const clickY = ((event.clientY - bounds.top) / bounds.height) * 100;
    const { target } = level;
    const isInsideTarget =
      clickX >= target.x &&
      clickX <= target.x + target.width &&
      clickY >= target.y &&
      clickY <= target.y + target.height;

    if (isInsideTarget) {
      playSuccessFeedback();
      onSuccess();
      return;
    }

    playFailFeedback();
    onFail();
  };

  const progress = (remainingMs / timeLimitMs) * 100;
  const sceneStatus: RoundStatus = status === "paused" ? "playing" : status;
  const statusText =
    status === "success" ? level.successText : status === "fail" ? level.failText : "";
  const levelLabel =
    mode === "classic" ? `${levelNumber}/${totalLevels}` : `#${levelNumber}`;

  return (
    <main className="screen game-screen">
      <header className="game-hud">
        <div className="hud-item hud-item--mode">
          <span>Режим</span>
          <strong>{MODE_LABELS[mode]}</strong>
        </div>
        <div className="hud-item">
          <span>{mode === "classic" ? "Уровень" : "Раунд"}</span>
          <strong>{levelLabel}</strong>
        </div>
        <div className="hud-item">
          <span>Счёт</span>
          <strong>{score}</strong>
        </div>
        <div className="hud-item">
          <span>Таймер</span>
          <strong>{(remainingMs / 1000).toFixed(1)}</strong>
        </div>
      </header>

      <div className="game-actions">
        {mode === "endless" && (
          <div className="combo-chip">
            Серия <strong>x{combo}</strong>
          </div>
        )}
        <SoundToggle
          compact
          soundEnabled={soundEnabled}
          onToggle={onToggleSound}
        />
        <button
          className="small-button"
          type="button"
          onClick={onPause}
          disabled={status !== "playing"}
        >
          Пауза
        </button>
      </div>

      <section className="level-copy">
        <h1>{level.title}</h1>
        <p>{level.description}</p>
      </section>

      <TimerBar progress={progress} />

      <div
        className={`game-area game-area--${status}`}
        onClick={handleAreaClick}
        role="button"
        tabIndex={0}
        aria-label={`Сцена: ${level.title}. Цель: ${level.target.label}`}
      >
        <SceneRenderer level={level} status={sceneStatus} />
        <div
          className={`hit-zone${DEBUG_TARGET ? " hit-zone--debug" : ""}`}
          style={{
            left: `${level.target.x}%`,
            top: `${level.target.y}%`,
            width: `${level.target.width}%`,
            height: `${level.target.height}%`,
          }}
          aria-hidden="true"
        />
        {(status === "success" || status === "fail") && (
          <div className={`status-card status-card--${status}`}>
            <strong>{status === "success" ? "Спасено!" : "Провал"}</strong>
            <span>{statusText}</span>
            {status === "success" && <small>Следующая опасность...</small>}
            {comboMessage && <em>{comboMessage}</em>}
          </div>
        )}
        {status === "paused" && (
          <div className="pause-overlay">
            <div className="pause-panel">
              <h2>Пауза</h2>
              <button className="primary-button" type="button" onClick={onResume}>
                Продолжить
              </button>
              <button className="secondary-button" type="button" onClick={onMenu}>
                В меню
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
