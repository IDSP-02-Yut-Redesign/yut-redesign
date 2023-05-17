class MainboardScene extends Phaser.Scene {
  #WIDTH;
  #HEIGHT;
  #outputNumber;
  #gamePath = [];

  constructor() {
    super("MainboardScene");
  }

  create() {
    
    // Create roll button and make it interactive
    this.rollButton = this.add
      .sprite(0, 0, "roll")
      .setScale(1.25, 1.25)
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      )
      .setInteractive();
    this.rollButton.on("pointerdown", this.onRollButtonClick, this);

    // Create dice sprite at the center
    this.dice = this.add.sprite(0, 0, "diceone");
    this.dice.setScale(1.5, 1.5);
    this.dice.setPosition(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2
    );
    this.dice.setVisible(false);
  }

  onRollButtonClick() {
    this.rollButton.setVisible(false);
    this.dice.setVisible(true);

    this.rollDice((outputNumber) => {
      console.log("Output Number:", outputNumber);

      // Move marker should be inside the callback
      this.moveMarker(this.playerOneMarker, outputNumber);
    });
  }

  rollDice(callback) {
    // Start dice rolling animation
    let diceAnimation = this.time.addEvent({
      delay: 100,
      callback: this.randomizeDiceFace,
      callbackScope: this,
      loop: true,
    });
    // Stop dice rolling animation after 2 seconds
    this.time.delayedCall(2000, () => {
      diceAnimation.remove();
      let curruntOutputNumber = this.getDiceNumberFromFace(
        this.dice.texture.key
      );
      this.#outputNumber = curruntOutputNumber;
      if (callback) {
        callback(curruntOutputNumber);
      }
    });
  }

  randomizeDiceFace() {
    let diceFaces = [
      "diceone",
      "dicetwo",
      "dicethree",
      "dicefour",
      "dicefive",
      "dicesix",
    ];
    let randomFace = Phaser.Math.RND.pick(diceFaces);
    this.dice.setTexture(randomFace);
  }

  getDiceNumberFromFace(diceFace) {
    let diceFaceToNumberMap = {
      diceone: 1,
      dicetwo: 2,
      dicethree: 3,
      dicefour: 4,
      dicefive: 5,
      dicesix: 6,
    };
    return diceFaceToNumberMap[diceFace];
  }

  moveMarker(playerMarker, diceNumber) {
    let currentPositionIndex = this.#gamePath.findIndex(
      (point) => point.x === playerMarker.x && point.y === playerMarker.y
    );

    if (currentPositionIndex !== -1) {
      let nextPositionIndex =
        (currentPositionIndex + diceNumber) % this.#gamePath.length;
      let nextPosition = this.#gamePath[nextPositionIndex];

      this.tweens.add({
        targets: playerMarker,
        x: nextPosition.x,
        y: nextPosition.y,
        duration: 1000,
        onComplete: () => {
          // Make the roll button visible and dice invisible again after the marker has finished moving
          this.rollButton.setVisible(true);
          this.dice.setVisible(false);

          if (nextPositionIndex === 3) {
            console.log("Player has reached the mercury");
            this.scene.start("MeteorShowerScene");
          }
          if (nextPositionIndex === 6) {
            console.log("Player has reached the venus");
            this.scene.start("WordScene");
          }
          if (nextPositionIndex === 9) {
            console.log("Player has reached the earth");
            this.scene.start("TriviaScene");
          }
          if (nextPositionIndex === 12) {
            console.log("Player has reached the mars");
            this.scene.start("MemoryGameScene");
          }
        },
      });
    } else {
      console.log("Current position not found in game path");
    }
  }
}
