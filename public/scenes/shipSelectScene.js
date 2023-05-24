class ShipSelectScene extends Phaser.Scene {
  constructor() {
    super("ShipSelectScene");
  }

  preload() {

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
  }

  update() {
    this.bg.tilePositionX -= 1;
  }
}
