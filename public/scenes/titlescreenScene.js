class TitlescreenScene extends Phaser.Scene {
  constructor() {
    super("TitlescreenScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("lightspeedLogo", "assets/lightspeedLogo.png");
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
        this.sys.game.config.height / 1.5,
        "startButton"
      )
      .setScale(2, 2)
      .setInteractive();

    const lightspeedLogo = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4,
        "lightspeedLogo"
      )
      .setScale(1.5, 1.5);

    startButton.once("pointerup", () => {
      this.scene.start("MainboardScene");
    });
  }

  update() {
    this.bg.tilePositionX -= 1;
  }
}
