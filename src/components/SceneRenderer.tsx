import type { ReactNode } from "react";
import type { GameLevel, RoundStatus, SceneType } from "../game/types";

type SceneRendererProps = {
  level: GameLevel;
  status: RoundStatus;
};

type SceneStageProps = SceneRendererProps & {
  actor: string;
  danger: string;
  helper: string;
  successActor?: string;
  failActor?: string;
  children: ReactNode;
};

type TargetVisualProps = {
  level: GameLevel;
  emoji: string;
};

function TargetVisual({ level, emoji }: TargetVisualProps) {
  const centerX = level.target.x + level.target.width / 2;
  const centerY = level.target.y + level.target.height / 2;

  return (
    <div
      className="target-visual"
      style={{ left: `${centerX}%`, top: `${centerY}%` }}
      aria-hidden="true"
    >
      <span className="target-emoji">{level.scene.helperEmoji ?? emoji}</span>
      <span className="target-label">{level.target.label}</span>
    </div>
  );
}

function SceneStage({
  level,
  status,
  actor,
  danger,
  helper,
  successActor,
  failActor,
  children,
}: SceneStageProps) {
  const type = level.scene.type;
  const baseActorEmoji = level.scene.emoji ?? actor;
  const actorEmoji =
    status === "success"
      ? (successActor ?? baseActorEmoji)
      : status === "fail"
        ? (failActor ?? baseActorEmoji)
        : baseActorEmoji;
  const dangerEmoji = level.scene.dangerEmoji ?? danger;

  return (
    <div className={`scene scene--${type} scene-state--${status}`}>
      <div className="scene-sky" />
      {children}
      <div className={`scene-actor actor--${type}`} aria-hidden="true">
        {actorEmoji}
      </div>
      <div className={`scene-danger danger--${type}`} aria-hidden="true">
        {status === "success" ? "✨" : dangerEmoji}
      </div>
      <TargetVisual level={level} emoji={helper} />
      {status !== "playing" && (
        <div className={`scene-outcome scene-outcome--${status}`} aria-hidden="true">
          {status === "success" ? "✓" : "!"}
        </div>
      )}
    </div>
  );
}

function SceneProp({ name, children }: { name: string; children?: ReactNode }) {
  return <div className={`scene-prop prop-${name}`}>{children}</div>;
}

function renderScene(
  type: SceneType,
  level: GameLevel,
  status: RoundStatus,
): ReactNode {
  switch (type) {
    case "falling-glass":
      return (
        <SceneStage level={level} status={status} actor="🥛" danger="💥" helper="✋" failActor="🧹">
          <SceneProp name="table" />
          <SceneProp name="person-left">😬</SceneProp>
          <SceneProp name="floor-spark">✦</SceneProp>
        </SceneStage>
      );
    case "cat-water":
      return (
        <SceneStage level={level} status={status} actor="🐱" danger="💧" helper="🛏️" successActor="😾">
          <SceneProp name="pool">💧💧💧</SceneProp>
          <SceneProp name="bath-edge" />
        </SceneStage>
      );
    case "car-pit":
      return (
        <SceneStage level={level} status={status} actor="🚗" danger="🕳️" helper="🪵">
          <SceneProp name="road" />
          <SceneProp name="pit">🕳️</SceneProp>
          <SceneProp name="sign">⚠️</SceneProp>
        </SceneStage>
      );
    case "rocket-planet":
      return (
        <SceneStage level={level} status={status} actor="🚀" danger="🪐" helper="↩️">
          <SceneProp name="stars">✦ ✧ ✦</SceneProp>
          <SceneProp name="planet">🪐</SceneProp>
        </SceneStage>
      );
    case "chef-cake":
      return (
        <SceneStage level={level} status={status} actor="🎂" danger="🧹" helper="🍽️">
          <SceneProp name="counter" />
          <SceneProp name="chef">👨‍🍳</SceneProp>
        </SceneStage>
      );
    case "phone-fall":
      return (
        <SceneStage level={level} status={status} actor="📱" danger="⚡" helper="🧸">
          <SceneProp name="desk" />
          <SceneProp name="crack">⚡</SceneProp>
        </SceneStage>
      );
    case "ball-window":
      return (
        <SceneStage level={level} status={status} actor="⚽" danger="🪟" helper="🧤">
          <SceneProp name="window">🪟</SceneProp>
          <SceneProp name="curtain" />
        </SceneStage>
      );
    case "pizza-fire":
      return (
        <SceneStage level={level} status={status} actor="🍕" danger="🔥" helper="🔴">
          <SceneProp name="oven">🔥</SceneProp>
          <SceneProp name="smoke">⌇⌇</SceneProp>
        </SceneStage>
      );
    case "bird-cactus":
      return (
        <SceneStage level={level} status={status} actor="🐦" danger="🌵" helper="☁️">
          <SceneProp name="sun">☀️</SceneProp>
          <SceneProp name="cactus">🌵</SceneProp>
          <SceneProp name="desert" />
        </SceneStage>
      );
    case "robot-banana":
      return (
        <SceneStage level={level} status={status} actor="🤖" danger="🍌" helper="🍌" failActor="🤕">
          <SceneProp name="lab-floor" />
          <SceneProp name="console">▣</SceneProp>
        </SceneStage>
      );
    case "rain-umbrella":
      return (
        <SceneStage level={level} status={status} actor="🧍" danger="🌧️" helper="☂️" successActor="😎">
          <SceneProp name="rain-cloud">☁️</SceneProp>
          <SceneProp name="rain-drops">╱╱╱</SceneProp>
          <SceneProp name="city-ground" />
        </SceneStage>
      );
    case "falling-bulb":
      return (
        <SceneStage level={level} status={status} actor="💡" danger="🌑" helper="📦">
          <SceneProp name="ceiling" />
          <SceneProp name="box" />
        </SceneStage>
      );
    case "fish-tank":
      return (
        <SceneStage level={level} status={status} actor="🐟" danger="💨" helper="🫧">
          <SceneProp name="aquarium">🫧</SceneProp>
          <SceneProp name="water-line" />
        </SceneStage>
      );
    case "alarm-clock":
      return (
        <SceneStage level={level} status={status} actor="⏰" danger="🔊" helper="🔕">
          <SceneProp name="bed">🛏️</SceneProp>
          <SceneProp name="sound-waves">)))</SceneProp>
        </SceneStage>
      );
    case "falling-book":
      return (
        <SceneStage level={level} status={status} actor="📚" danger="😵" helper="⛑️">
          <SceneProp name="bookshelf" />
          <SceneProp name="reader">🙂</SceneProp>
        </SceneStage>
      );
    case "melting-icecream":
      return (
        <SceneStage level={level} status={status} actor="🍦" danger="☀️" helper="🧊" failActor="🍨">
          <SceneProp name="hot-sun">☀️</SceneProp>
          <SceneProp name="fridge">▤</SceneProp>
          <SceneProp name="sweet-puddle" />
        </SceneStage>
      );
    case "train-rush":
      return (
        <SceneStage level={level} status={status} actor="🏃" danger="🚆" helper="⚡">
          <SceneProp name="tracks" />
          <SceneProp name="train">🚆</SceneProp>
          <SceneProp name="platform" />
        </SceneStage>
      );
    case "balloon-pin":
      return (
        <SceneStage level={level} status={status} actor="🎈" danger="📍" helper="🛡️" failActor="💥">
          <SceneProp name="party-floor" />
          <SceneProp name="pin">📍</SceneProp>
          <SceneProp name="confetti">✦ ✶ ✦</SceneProp>
        </SceneStage>
      );
    case "coffee-laptop":
      return (
        <SceneStage level={level} status={status} actor="☕" danger="💻" helper="🧻">
          <SceneProp name="workdesk" />
          <SceneProp name="laptop">💻</SceneProp>
          <SceneProp name="code-lines">⌁⌁</SceneProp>
        </SceneStage>
      );
    case "turtle-road":
      return (
        <SceneStage level={level} status={status} actor="🐢" danger="🚙" helper="🛑">
          <SceneProp name="road" />
          <SceneProp name="car-danger">🚙</SceneProp>
          <SceneProp name="grass-strip" />
        </SceneStage>
      );
    case "boiling-soup":
      return (
        <SceneStage level={level} status={status} actor="🍲" danger="♨️" helper="🔘">
          <SceneProp name="stove" />
          <SceneProp name="steam">♨️♨️</SceneProp>
        </SceneStage>
      );
    case "gift-conveyor":
      return (
        <SceneStage level={level} status={status} actor="🎁" danger="⬇️" helper="🧺">
          <SceneProp name="belt" />
          <SceneProp name="drop-zone">↓</SceneProp>
        </SceneStage>
      );
    case "snowman-sun":
      return (
        <SceneStage level={level} status={status} actor="⛄" danger="☀️" helper="☁️" failActor="💧">
          <SceneProp name="snow-ground" />
          <SceneProp name="hot-sun">☀️</SceneProp>
          <SceneProp name="snowflakes">✻ ✻</SceneProp>
        </SceneStage>
      );
    case "low-battery":
      return (
        <SceneStage level={level} status={status} actor="📱" danger="1%" helper="🔌">
          <SceneProp name="desk" />
          <SceneProp name="battery-warning">1%</SceneProp>
        </SceneStage>
      );
    case "paper-plane-tree":
      return (
        <SceneStage level={level} status={status} actor="✈️" danger="🌳" helper="💨">
          <SceneProp name="park-ground" />
          <SceneProp name="tree">🌳</SceneProp>
          <SceneProp name="wind-lines">~~~</SceneProp>
        </SceneStage>
      );
    case "mouse-trap":
      return (
        <SceneStage level={level} status={status} actor="🐭" danger="🪤" helper="🧀">
          <SceneProp name="kitchen-floor" />
          <SceneProp name="trap">🪤</SceneProp>
        </SceneStage>
      );
    case "falling-egg":
      return (
        <SceneStage level={level} status={status} actor="🥚" danger="🍳" helper="🍳" failActor="🍳">
          <SceneProp name="table" />
          <SceneProp name="breakfast-plate">🍞</SceneProp>
        </SceneStage>
      );
    case "pirate-shark":
      return (
        <SceneStage level={level} status={status} actor="🏴‍☠️" danger="🦈" helper="⛵">
          <SceneProp name="sea">≈≈≈</SceneProp>
          <SceneProp name="shark">🦈</SceneProp>
          <SceneProp name="mast">⚑</SceneProp>
        </SceneStage>
      );
    case "astronaut-rope":
      return (
        <SceneStage level={level} status={status} actor="🧑‍🚀" danger="🛰️" helper="🪢">
          <SceneProp name="stars">✦ ✧ ✦</SceneProp>
          <SceneProp name="spaceship">🚀</SceneProp>
          <SceneProp name="orbit-line" />
        </SceneStage>
      );
    case "dinosaur-meteor":
      return (
        <SceneStage level={level} status={status} actor="🦖" danger="☄️" helper="🌀">
          <SceneProp name="jungle-ground" />
          <SceneProp name="meteor">☄️</SceneProp>
          <SceneProp name="volcano">🌋</SceneProp>
        </SceneStage>
      );
  }
}

export function SceneRenderer({ level, status }: SceneRendererProps) {
  return renderScene(level.scene.type, level, status);
}
