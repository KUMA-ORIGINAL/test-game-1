type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const AudioContextConstructor =
    window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  try {
    audioContext ??= new AudioContextConstructor();
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType,
  volume: number,
  startDelayMs = 0,
): void {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  try {
    if (context.state === "suspended") {
      void context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime + startDelayMs / 1000;
    const duration = durationMs / 1000;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.015);
  } catch {
    // Browsers can block or interrupt audio; feedback is nice-to-have.
  }
}

export function playClickSound(): void {
  playTone(520, 42, "triangle", 0.05);
}

export function playSuccessSound(): void {
  playTone(620, 70, "sine", 0.055);
  playTone(880, 95, "sine", 0.045, 62);
}

export function playFailSound(): void {
  playTone(180, 120, "sawtooth", 0.045);
  playTone(120, 150, "triangle", 0.035, 82);
}
