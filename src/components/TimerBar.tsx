type TimerBarProps = {
  progress: number;
};

export function TimerBar({ progress }: TimerBarProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="timer-track" aria-label={`Осталось ${Math.round(safeProgress)}% времени`}>
      <div className="timer-fill" style={{ width: `${safeProgress}%` }} />
    </div>
  );
}
