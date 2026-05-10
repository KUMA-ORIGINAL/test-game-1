type SoundToggleProps = {
  soundEnabled: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export function SoundToggle({
  soundEnabled,
  onToggle,
  compact = false,
}: SoundToggleProps) {
  return (
    <button
      className={`sound-toggle${compact ? " sound-toggle--compact" : ""}`}
      type="button"
      aria-pressed={soundEnabled}
      onClick={onToggle}
    >
      <span aria-hidden="true">{soundEnabled ? "🔊" : "🔇"}</span>
      {!compact && <span>{soundEnabled ? "Звук вкл" : "Звук выкл"}</span>}
    </button>
  );
}
