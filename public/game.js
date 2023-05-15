const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MinigameSelectionScene, TriviaScene, MeteorShowerScene, WordScene, MemoryGameScene],
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