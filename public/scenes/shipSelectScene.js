class ShipSelectScene extends Phaser.Scene {
  constructor() {
    super("ShipSelectScene");
  }

  preload() {
    this.load.image("bigPlayerOne", "assets/bigPlayerOne.png");
    this.load.image("bigPlayerTwo", "assets/bigPlayerTwo.png");
    this.load.image("bigPlayerThree", "assets/bigPlayerThree.png");
    this.load.image("bigPlayerFour", "assets/bigPlayerFour.png");
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

    const playerOneButton = this.add.sprite(
        this.sys.game.config.width / 1.2,
        this.sys.game.config.height / 4,
        "bigPlayerOne"
    )
    .setInteractive();
    
    const playerTwoButton = this.add.sprite(
        this.sys.game.config.width / 2.2,
        this.sys.game.config.height / 4,
        "bigPlayerTwo"
    )
    .setInteractive();

    const playerThreeButton = this.add.sprite(
        this.sys.game.config.width / 3,
        this.sys.game.config.height / 4,
        "bigPlayerThree"
    )
    .setInteractive();

    const playerFourButton = this.add.sprite(
        this.sys.game.config.width / 5,
        this.sys.game.config.height / 4,
        "bigPlayerFour"
    )
    .setInteractive();
  }

  update() {
    this.bg.tilePositionX -= 1;
  }
}
