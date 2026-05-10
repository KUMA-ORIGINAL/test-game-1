export type GameMode = "classic" | "endless";

export type GameStatus =
  | "menu"
  | "howToPlay"
  | "playing"
  | "paused"
  | "success"
  | "fail"
  | "gameOver";

export type RoundStatus = Extract<GameStatus, "playing" | "success" | "fail">;

export type ActiveGameStatus = Extract<
  GameStatus,
  "playing" | "paused" | "success" | "fail"
>;

export type SceneType =
  | "falling-glass"
  | "cat-water"
  | "car-pit"
  | "rocket-planet"
  | "chef-cake"
  | "phone-fall"
  | "ball-window"
  | "pizza-fire"
  | "bird-cactus"
  | "robot-banana"
  | "rain-umbrella"
  | "falling-bulb"
  | "fish-tank"
  | "alarm-clock"
  | "falling-book"
  | "melting-icecream"
  | "train-rush"
  | "balloon-pin"
  | "coffee-laptop"
  | "turtle-road"
  | "boiling-soup"
  | "gift-conveyor"
  | "snowman-sun"
  | "low-battery"
  | "paper-plane-tree"
  | "mouse-trap"
  | "falling-egg"
  | "pirate-shark"
  | "astronaut-rope"
  | "dinosaur-meteor";

export type TargetZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

export type GameLevel = {
  id: number;
  title: string;
  description: string;
  timeLimitMs: number;
  successText: string;
  failText: string;
  target: TargetZone;
  scene: {
    type: SceneType;
    emoji?: string;
    dangerEmoji?: string;
    helperEmoji?: string;
  };
};
