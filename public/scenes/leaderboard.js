class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("LeaderboardScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
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

    this.backButton = this.add
      .text(30, 30, "Back")
      .setScale(2)
      .setInteractive();

    this.title = this.add
      .text(this.WIDTH / 2, this.HEIGHT / 6, "lEADERBOARD")
      .setOrigin(0.5, 0, 5)
      .setScale(3);

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

    this.backButton.on("pointerdown", this.onBackButtonClick, this);
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

  onBackButtonClick() {
    this.scene.start("TitlescreenScene");
  }
}
