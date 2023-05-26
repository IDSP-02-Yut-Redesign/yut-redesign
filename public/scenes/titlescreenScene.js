class TitlescreenScene extends Phaser.Scene {
  #bgm;

  constructor() {
    super("TitlescreenScene");
  }

  preload() {
    this.load.audio("bgm", "assets/audio/bgm.mp3");
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("lightspeedLogo", "assets/lightspeedLogo.png");
    this.load.image("questionBox", "assets/questionBox.png");

    this.sys.events.on("resume", () => {
      this.scene.setVisible(true);
      this.scene.setActive(true);
    });
  }

  create() {
    if (!this.#bgm) {
      this.#bgm = this.sound.add("bgm", { loop: true });
      this.sound.play("bgm");
    }
    // TEMPORARY USERNAME SELECTION (comment out/remove later)
    this.createUser = function () {
      const userInput = prompt(
        "Welcome to LightSpeed! Please enter a username."
      );
      try {
        this.getAllUsernames().then((usernames) => {
          console.log(usernames);
          usernames.forEach((username) => {
            if (userInput === username) {
              this.createUser();
            }
          });
        });
      } catch (error) {
        console.warn(error);
      }
      document.cookie = `username=${userInput}`;
    };

    this.getAllUsernames = async function () {
      const response = await fetch("/scores/allUsernames");
      if (response.ok) {
        const usernames = await response.json();
        return usernames;
      }
    };

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

    const lightspeedLogo = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4 + 40,
        "lightspeedLogo"
      )
      .setScale(1.5, 1.5);

    const startButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 - 10,
        "questionBox"
      )
      .setScale(1.1, 2)
      .setInteractive();
    this.add
      .text(
        this.sys.game.config.width / 2 - 110,
        this.sys.game.config.height / 1.5 - 28,
        "BOARD GAME",
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      )
      .setScale(2, 2);

    const miniGameButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 + 75,
        "questionBox"
      )
      .setScale(1.1, 2)
      .setInteractive();

    this.add
      .text(
        this.sys.game.config.width / 2 - 100,
        this.sys.game.config.height / 1.5 + 57,
        "MINIGAMES",
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      )
      .setScale(2, 2);

    const leaderboardButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 + 160,
        "questionBox"
      )
      .setScale(1.1, 2)
      .setInteractive();

    this.add
      .text(
        this.sys.game.config.width / 2 - 118,
        this.sys.game.config.height / 1.5 + 143,
        "LEADERBOARD",
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      )
      .setScale(2, 2);

    startButton.once("pointerup", () => {
      this.scene.start("UsernameScene");
      this.scene.stop();
      this.scene.setVisible(false);
      this.scene.setActive(false);
    });

    miniGameButton.once("pointerup", () => {
      this.scene.start("MinigameSelectionScene");
      this.scene.pause();
      this.scene.setVisible(false);
      this.scene.setActive(false);
    });

    leaderboardButton.once("pointerup", () => {
      this.scene.start("LeaderboardScene");
      this.scene.pause();
      this.scene.setVisible(false);
      this.scene.setActive(false);
    });
  }

  update() {
    // Update the position of both background sprites
    this.bg1.tilePositionX -= 1;
    this.bg2.tilePositionX -= 1;
  }
}
