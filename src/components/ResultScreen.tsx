import type { GameMode } from "../game/types";

const MODE_LABELS: Record<GameMode, string> = {
  classic: "Классика",
  endless: "Бесконечный режим",
};

type ResultScreenProps = {
  mode: GameMode;
  score: number;
  bestScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onMenu: () => void;
};

export function ResultScreen({
  mode,
  score,
  bestScore,
  isNewRecord,
  onRestart,
  onMenu,
}: ResultScreenProps) {
  return (
    <main className="screen result-screen">
      <section className="result-panel">
        <div className="result-emoji">{isNewRecord ? "🏆" : "⏱️"}</div>
        <div>
          <span className="mode-pill">{MODE_LABELS[mode]}</span>
          <h1>Игра окончена</h1>
        </div>
        {isNewRecord && <p className="record-note">Новый рекорд!</p>}

        <div className="score-grid">
          <div>
            <span>Счёт</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>Лучший</span>
            <strong>{bestScore}</strong>
          </div>
        </div>

        <div className="button-row">
          <button className="primary-button" type="button" onClick={onRestart}>
            Играть снова
          </button>
          <button className="secondary-button" type="button" onClick={onMenu}>
            В меню
          </button>
        </div>
      </section>
    </main>
  );
}
