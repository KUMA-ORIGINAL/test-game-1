import { useState } from "react";
import type { GameMode } from "../game/types";
import { SoundToggle } from "./SoundToggle";

type MenuAction = GameMode | "howToPlay";

const PRANK_MESSAGES: Record<MenuAction, string[]> = {
  classic: [
    "Классика делает вид, что её нет. Нажми ещё раз, только серьёзно.",
    "Кнопка проверяет реакцию. Второй тап откроет опасности.",
  ],
  endless: [
    "Бесконечный режим испугался своей бесконечности. Тапни ещё раз.",
    "Сначала нужно морально подготовить кнопку. Готово, жми снова.",
  ],
  howToPlay: [
    "Инструкция спряталась за диван. Ещё один клик — и она выйдет.",
    "Кнопка требует пароль: КУМА. Ладно, просто нажми ещё раз.",
  ],
};

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
  const [armedActions, setArmedActions] = useState<Record<MenuAction, boolean>>({
    classic: false,
    endless: false,
    howToPlay: false,
  });
  const [prankMessage, setPrankMessage] = useState("");
  const [prankTarget, setPrankTarget] = useState<MenuAction | null>(null);

  const handlePrankClick = (action: MenuAction, onReady: () => void) => {
    if (!armedActions[action]) {
      const messages = PRANK_MESSAGES[action];
      const message = messages[Math.floor(Math.random() * messages.length)] ?? messages[0];

      setArmedActions((currentActions) => ({
        ...currentActions,
        [action]: true,
      }));
      setPrankMessage(message);
      setPrankTarget(action);
      return;
    }

    setPrankMessage("");
    setPrankTarget(null);
    onReady();
  };

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
            className={`primary-button prank-button${
              prankTarget === "classic" ? " prank-button--tease" : ""
            }`}
            type="button"
            onClick={() => handlePrankClick("classic", () => onStart("classic"))}
          >
            Классика
          </button>
          <button
            className={`primary-button primary-button--hot prank-button${
              prankTarget === "endless" ? " prank-button--tease" : ""
            }`}
            type="button"
            onClick={() => handlePrankClick("endless", () => onStart("endless"))}
          >
            Бесконечный режим
          </button>
        </div>

        {prankMessage && (
          <div className="prank-message" role="status" aria-live="polite">
            {prankMessage}
          </div>
        )}

        <button
          className={`secondary-button prank-button${
            prankTarget === "howToPlay" ? " prank-button--tease" : ""
          }`}
          type="button"
          onClick={() => handlePrankClick("howToPlay", onHowToPlay)}
        >
          Как играть
        </button>
      </section>
    </main>
  );
}
