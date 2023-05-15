const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MinigameSelectionScene, TriviaScene, MeteorShowerScene, WordScene, MemoryGameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 900,
    },
    zoom: 1,
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