class MinigameSelectionScene extends Phaser.Scene {
  constructor() {
    super("MinigameSelectionScene");
  }

  preload() {
    // load images
    this.load.image("background", "assets/background.png");
    this.load.image("finalcompleteboard", "assets/finalcompleteboard.png");
    this.load.image("earth", "assets/earth.png");
    this.load.image("sun", "assets/sun.png");
    this.load.image("mercury", "assets/mercury.png");
    this.load.image("venus", "assets/venus.png");
    this.load.image("mars", "assets/mars.png");
    this.load.image("jupiter", "assets/jupiter.png");
    this.load.image("saturn", "assets/saturn.png");
    this.load.image("uranus", "assets/uranus.png");
    this.load.image("neptune", "assets/neptune.png");
    this.load.image("star", "assets/star.png");
    this.load.image("questionBox", "assets/questionBox.png");
    // this.load.image("meteorite", "assets/meteorite.png");
    // this.load.image("satellite", "assets/satellite.png");
    // this.load.image("startButton", "assets/startButton.png");

    this.sys.events.on("resume", () => {
      this.scene.setVisible(true);
      this.scene.setActive(true);
    });
  }

  create() {
    // Set background size
    const bgWidth = this.sys.game.config.width;
    const bgHeight = this.sys.game.config.height;

    // Create two background sprites, offset by half the width of the image
    this.bg1 = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, "background")
      .setScale(1, 1)
      .setPosition(bgWidth / 2, bgHeight / 2);

    this.bg2 = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, "background")
      .setScale(1, 1)
      .setPosition(bgWidth / 2 - 15, bgHeight / 2 + 5);

    // create inner board
    this.add
      .sprite(0, 0, "finalcompleteboard")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );

    const backButton = this.add
      .sprite(135, 35, "questionBox")
      .setScale(1, 1.5)
      .setInteractive();
    this.add
      .text(30, 22, "BACK TO TITLE", {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setScale(1.5, 1.5);

    backButton.once("pointerup", () => {
      this.scene.start("TitlescreenScene");
    });

    // Create sun and make it interactive
    let sun = this.add
      .sprite(0, 0, "sun")
      .setScale(2.25, 2.25)
      .setPosition(
        this.sys.game.config.width / 2 - 290,
        this.sys.game.config.height / 2 + 10
      )
      .setInteractive();
    sun.on("pointerdown", this.onSunClick, this);

    // Add text box for the sun
    let sunText = this.add.text(
      sun.x - sun.width / 2 - 45,
      sun.y - sun.height / 2 + 70,
      "Meteor Shower!",
      {
        fontSize: "18px",
        fill: "#ffffff",
      }
    );

    // create star1
    let star1 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 255,
        this.sys.game.config.height / 2 - 75
      );

    // create star2
    let star2 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 235,
        this.sys.game.config.height / 2 - 95
      );

    // create mercury
    this.add
      .sprite(0, 0, "mercury")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 - 200,
        this.sys.game.config.height / 2 - 115
      );

    // create star3
    let star3 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 165,
        this.sys.game.config.height / 2 - 133
      );

    // create star4
    let star4 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 140,
        this.sys.game.config.height / 2 - 142
      );

    // create venus
    this.add
      .sprite(0, 0, "venus")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 - 95,
        this.sys.game.config.height / 2 - 155
      );

    // create star5
    let star5 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 50,
        this.sys.game.config.height / 2 - 160
      );

    // create star6
    let star6 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 22,
        this.sys.game.config.height / 2 - 163
      );

    // Create earth and make it interactive
    let earth = this.add
      .sprite(0, 0, "earth")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 + 35,
        this.sys.game.config.height / 2 - 170
      )
      .setInteractive();
    earth.on("pointerdown", this.onEarthClick, this);

    // Add text box for the earth
    let earthText = this.add.text(
      earth.x - earth.width / 2 - 35,
      earth.y - earth.height / 2 + 50,
      "Typing Game!",
      {
        fontSize: "18px",
        fill: "#ffffff",
      }
    );

    // create star7
    let star7 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 95,
        this.sys.game.config.height / 2 - 157
      );

    // create star8
    let star8 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 125,
        this.sys.game.config.height / 2 - 151
      );

    // create mars
    this.add
      .sprite(0, 0, "mars")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 + 185,
        this.sys.game.config.height / 2 - 140
      );

    // create star9
    let star9 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 240,
        this.sys.game.config.height / 2 - 108
      );

    // create star10
    let star10 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 265,
        this.sys.game.config.height / 2 - 90
      );

    // Create jupiter and make it interactive
    let jupiter = this.add
      .sprite(0, 0, "jupiter")
      .setScale(1.3, 1.3)
      .setPosition(
        this.sys.game.config.width / 2 + 305,
        this.sys.game.config.height / 2 - 25
      )
      .setInteractive();
    jupiter.on("pointerdown", this.onJupiterClick, this);

    // Add text box for the jupiter
    let jupiterText = this.add.text(
      jupiter.x - jupiter.width / 2 - 30,
      jupiter.y - jupiter.height / 2 + 85,
      "Space Trivia!",
      {
        fontSize: "18px",
        fill: "#ffffff",
      }
    );

    // create star11
    let star11 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 290,
        this.sys.game.config.height / 2 + 45
      );

    // create star12
    let star12 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 272,
        this.sys.game.config.height / 2 + 67
      );

    // create saturn
    this.add
      .sprite(0, 0, "saturn")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 + 215,
        this.sys.game.config.height / 2 + 110
      );

    let star13 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 110,
        this.sys.game.config.height / 2 + 137
      );

    // create star14
    let star14 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 + 80,
        this.sys.game.config.height / 2 + 142
      );

    // Create neptune and make it interactive
    let neptune = this.add
      .sprite(0, 0, "neptune")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 + 10,
        this.sys.game.config.height / 2 + 150
      )
      .setInteractive();
    neptune.on("pointerdown", this.onNeptuneClick, this);

    // Add text box for the neptune
    let neptuneText = this.add.text(
      neptune.x - neptune.width / 2 - 40,
      neptune.y - neptune.height / 2 + 60,
      "Card Matching!",
      {
        fontSize: "18px",
        fill: "#ffffff",
      }
    );

    // create star15
    let star15 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 60,
        this.sys.game.config.height / 2 + 142
      );

    // create star16
    let star16 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 90,
        this.sys.game.config.height / 2 + 137
      );

    // create uranus
    this.add
      .sprite(0, 0, "uranus")
      .setScale(1.5, 1.5)
      .setPosition(
        this.sys.game.config.width / 2 - 155,
        this.sys.game.config.height / 2 + 120
      );

    // create star17
    let star17 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 215,
        this.sys.game.config.height / 2 + 90
      );

    // create star18
    let star18 = this.add
      .sprite(0, 0, "star")
      .setScale(1, 1)
      .setPosition(
        this.sys.game.config.width / 2 - 240,
        this.sys.game.config.height / 2 + 73
      );
  }

  onSunClick() {
    this.sys.game.scene.pause("MinigameSelectionScene");
    this.scene.setVisible(false);
    this.scene.setActive(false);
    this.sys.game.scene.start("MeteorShowerScene", { source: "MinigameSelectionScene" });
  }

  onEarthClick() {
    this.sys.game.scene.pause("MinigameSelectionScene");
    this.scene.setVisible(false);
    this.scene.setActive(false);
    this.sys.game.scene.start("WordScene", { source: "MinigameSelectionScene" });
  }

  onJupiterClick() {
    this.sys.game.scene.pause("MinigameSelectionScene");
    this.scene.setVisible(false);
    this.scene.setActive(false);
    this.sys.game.scene.start("TriviaScene", { source: "MinigameSelectionScene" });
  }

  onNeptuneClick() {
    this.sys.game.scene.pause("MinigameSelectionScene");
    this.scene.setVisible(false);
    this.scene.setActive(false);
    this.sys.game.scene.start("MemoryGameScene", { source: "MinigameSelectionScene" });
  }

  update() {
    // Update the position of both background sprites
    this.bg1.tilePositionX -= 1;
    this.bg2.tilePositionX -= 1;
  }
}
