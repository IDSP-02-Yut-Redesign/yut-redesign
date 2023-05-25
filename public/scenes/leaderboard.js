class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("LeaderboardScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");

    this.sys.events.on("resume", () => {
      this.scene.setVisible(true);
      this.scene.setActive(true);
    });
  }

  create() {
    this.WIDTH = this.sys.game.config.width;
    this.HEIGHT = this.sys.game.config.height;

    this.bg1 = this.add
      .tileSprite(0, 0, this.WIDTH, this.HEIGHT, "background")
      .setScale(1, 1)
      .setPosition(this.WIDTH / 2 + 30, this.HEIGHT / 2);

    this.bg2 = this.add
      .tileSprite(0, 0, this.WIDTH, this.HEIGHT, "background")
      .setScale(1, 1)
      .setPosition(this.WIDTH / 2, this.HEIGHT / 2 + 4);

    this.title = this.add
      .text(this.WIDTH / 2, this.HEIGHT / 6, "lEADERBOARD")
      .setOrigin(0.5, 0, 5)
      .setScale(3);

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
      this.scene.setVisible(false);
      this.scene.setActive(false);
      this.scene.pause();
    });

    try {
      this.getTop10Scores().then((scores) => {
        let i = 1;
        scores.forEach((score) => {
          this.placeScore(score, i);
          i++;
        });
      });
    } catch (error) {
      console.warn(error);
    }
  }

  update() {
    this.bg1.tilePositionX -= 1;
    this.bg2.tilePositionX -= 1;
  }

  async getTop10Scores() {
    const response = await fetch("/score/top10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const scores = await response.json();
    return scores;
  }

  placeScore(scoreEntry, rank) {
    this.add
      .text(
        this.WIDTH / 2,
        this.HEIGHT / 4 + rank * 35,
        `${rank}. ${scoreEntry.username} ${scoreEntry.score}`
      )
      .setOrigin(0.5, 0.5)
      .setScale(2);
  }
}
