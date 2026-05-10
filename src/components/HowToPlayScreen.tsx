type HowToPlayScreenProps = {
  onBack: () => void;
};

export function HowToPlayScreen({ onBack }: HowToPlayScreenProps) {
  return (
    <main className="screen info-screen">
      <section className="info-panel">
        <h1>Как играть</h1>
        <p>Твоя задача — спасти ситуацию одним тапом.</p>

        <div className="how-list">
          <span>Смотри на сцену.</span>
          <span>Найди предмет, который может помочь.</span>
          <span>Нажми на него до конца таймера.</span>
          <span>Ошибся или не успел — игра окончена.</span>
        </div>

        <button className="secondary-button" type="button" onClick={onBack}>
          Назад
        </button>
      </section>
    </main>
  );
}
