class TitlescreenScene extends Phaser.Scene {
  constructor() {
    super("TitlescreenScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("lightspeedBox", "assets/lightspeedBox.png");
  }

  create() {
    this.bg = this.add
      .tileSprite(
        0,
        0,
        this.sys.game.config.width,
        this.sys.game.config.height,
        "background"
      )
      .setScale(1.3, 1.3)
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );

    const startButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "startButton"
      )
      .setScale(2, 2)
      .setInteractive();

    const lightspeedBox = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        "lightspeedBox"
      )
      .setScale(2, 2);

    startButton.once("pointerup", () => {
      this.scene.start("MainboardScene");
    });
  }

  update() {
    this.bg.tilePositionX -= 1;
  }
}
