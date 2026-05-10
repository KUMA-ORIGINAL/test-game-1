import type { GameMode } from "../game/types";
import { SoundToggle } from "./SoundToggle";

type MenuScreenProps = {
  bestScores: Record<GameMode, number>;
  soundEnabled: boolean;
  onStart: (mode: GameMode) => void;
  onHowToPlay: () => void;
  onToggleSound: () => void;
};

export function MenuScreen({
  bestScores,
  soundEnabled,
  onStart,
  onHowToPlay,
  onToggleSound,
}: MenuScreenProps) {
  return (
    <main className="screen menu-screen">
      <section className="menu-panel">
        <div className="menu-topline">
          <div className="menu-badge">⚡ 30 мини-сцен</div>
          <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
        </div>

        <h1>Спаси за секунду</h1>
        <p>Нажми в нужное место, пока не стало поздно</p>

        <div className="records-grid">
          <div className="record-card">
            <span>Рекорд Classic</span>
            <strong>{bestScores.classic}</strong>
          </div>
          <div className="record-card">
            <span>Рекорд Endless</span>
            <strong>{bestScores.endless}</strong>
          </div>
        </div>

        <div className="mode-grid">
          <button
            className="primary-button"
            type="button"
            onClick={() => onStart("classic")}
          >
            Классика
          </button>
          <button
            className="primary-button primary-button--hot"
            type="button"
            onClick={() => onStart("endless")}
          >
            Бесконечный режим
          </button>
        </div>

        <button className="secondary-button" type="button" onClick={onHowToPlay}>
          Как играть
        </button>
      </section>
    </main>
  );
}
