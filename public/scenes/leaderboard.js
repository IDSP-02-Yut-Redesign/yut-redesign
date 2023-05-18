class LeaderboardScene extends Phaser.Scene {
  #scoresAdded;
  constructor() {
    super("LeaderboardScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
  }

  create() {
    this.WIDTH = this.sys.game.config.width;
    this.HEIGHT = this.sys.game.config.height;
    this.#scoresAdded = false;

    this.bg = this.add
      .sprite(0, 0, "background")
      .setPosition(this.WIDTH / 2, this.HEIGHT / 2);

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

  async getTop10Scores() {
    const response = await fetch("/scores/top10", {
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
    this.scene.start("Game");
  }
}
