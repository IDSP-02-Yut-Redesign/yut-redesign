const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
const DEFAULT_HEIGHT = 600; // any height you want
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT;

const config = {
  type: Phaser.AUTO,
  parent: "phaser",
  scene: [MainboardScene, MinigameSelectionScene, TriviaScene, MeteorShowerScene, WordScene, MemoryGameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);