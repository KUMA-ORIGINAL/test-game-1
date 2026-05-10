function vibrate(pattern: VibratePattern): void {
  navigator.vibrate?.(pattern);
}

export function vibrateSuccess(): void {
  vibrate(30);
}

export function vibrateFail(): void {
  vibrate([40, 40, 80]);
}

export function vibrateClick(): void {
  vibrate(10);
}
