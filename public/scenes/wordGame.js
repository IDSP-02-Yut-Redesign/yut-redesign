class WordScene extends Phaser.Scene {
  // initialize variables
  #timer;
  #planets;
  #meteorite;
  #satellite;
  #scoreText;
  #score;
  #planetsRemoved;
  #gameTimeLimit;
  #scoreFactor;
  #typedWord;
  #timerEvent;
  #timerEventAdded;
  #gameStarted;
  #gameOver;
  #typedWordText;
  #scoreSaved;
  #gameOverDisplayed;
  #calledFrom;

  constructor() {
    super("WordScene");
  }

  init(data) {
    const { source } = data;
    this.#calledFrom = source;
  }

  preload() {
    // load images
    this.load.image("background", "assets/background.png");
    this.load.image("sun", "assets/sun.png");
    this.load.image("mercury", "assets/mercury.png");
    this.load.image("venus", "assets/venus.png");
    this.load.image("earth", "assets/earth.png");
    this.load.image("mars", "assets/mars.png");
    this.load.image("jupiter", "assets/jupiter.png");
    this.load.image("saturn", "assets/saturn.png");
    this.load.image("uranus", "assets/uranus.png");
    this.load.image("neptune", "assets/neptune.png");
    this.load.image("meteorite", "assets/meteorite.png");
    this.load.image("satellite", "assets/satellite.png");
    this.load.image("startButton", "assets/startButton.png");
  }

  create() {
    this.#timer;
    this.#planets;
    if (this.#meteorite) {
      this.#meteorite.destroy();
      this.#meteorite = null;
    }
    if (this.#satellite) {
      this.#satellite.destroy();
      this.#satellite = null;
    }
    this.#scoreText;
    this.#score = 0;
    this.#planetsRemoved = 0;
    this.#gameTimeLimit = 30;
    this.#scoreFactor = 1;
    this.#typedWord = "";
    if (this.#timerEvent) {
      this.#timerEvent.destroy();
      this.#timerEvent = null;
    }
    this.#timerEventAdded = false;
    this.#gameStarted = false;
    this.#gameOver = false;
    if (this.#typedWordText) {
      this.#typedWordText.destroy();
      this.#typedWordText = null;
    }
    this.#scoreSaved = false;
    this.#gameOverDisplayed = false;

    const offscreenInput = document.getElementById("offscreen-input");
    offscreenInput.value = "";
    offscreenInput.addEventListener("input", (event) => {
      this.#typedWord = event.target.value;
      this.#typedWordText.setText(this.#typedWord);
    });

    offscreenInput.addEventListener("focus", () => {
      if (!this.#gameStarted) {
        offscreenInput.blur();
      }
    });

    // create bg sprite
    this.add
      .sprite(0, 0, "background")
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    this.#scoreText = this.add.text(0, 0, "Score: 0");
    this.#timer = this.add.text(
      this.sys.game.config.width - 90,
      0,
      `Timer: ${this.#gameTimeLimit}`
    );
    this.#timer.depth = 1;
    this.#typedWordText = this.add.text(
      this.sys.game.config.width / 2,
      550,
      ""
    );
    this.#typedWordText.setOrigin(0.5);

    // create satellite
    this.#satellite = this.add
      .sprite(0, 0, "satellite")
      .setScale(5)
      .setAngle(320)
      .setPosition(this.sys.game.config.width / 2, 630);

    // create meteorite
    this.#meteorite = this.add
      .sprite(0, 0, "meteorite")
      .setScale(2)
      .setAngle(220)
      .setPosition(this.sys.game.config.width / 2 + 800, 600);
    this.#meteorite.visible = false;

    this.#planets = this.add.group();

    // create start button
    const startButton = this.add
       .sprite(
         this.sys.game.config.width / 2,
         this.sys.game.config.height / 2,
         "startButton"
       )
       .setInteractive();

     startButton.once("pointerdown", () => {
       startButton.setVisible(false);
    this.#gameStarted = true;

    offscreenInput.focus();

    if (!this.#timerEventAdded) {
      this.#timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
      });
      this.#timerEventAdded = true;
    }
    this.spawnPlanets.call(this);
   });

    function handleKeyboardInput(event) {
      if (!this.#gameOver && this.#gameStarted) {
        if (event.key === "Enter") {
          checkWord.call(this);
        } else if (event.key === "Backspace") {
          this.#typedWord = this.#typedWord.slice(0, -1);
        } else if (event.key === " ") {
          this.#typedWord += " ";
        } else if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
          this.#typedWord += event.key;
        }
        this.#typedWordText.setText(this.#typedWord);
      }
    }

    window.addEventListener("keydown", handleKeyboardInput.bind(this));

    // check if the typed word matches any of the words in the planets
    function checkWord() {
      const targetTextContainer = this.#planets.children.entries.find(
        (textContainer) => {
          const text = textContainer.list && textContainer.list[1];
          return (
            text &&
            text.text &&
            text.text === this.#typedWord.replace(/\s+/g, "")
          );
        }
      );

      if (targetTextContainer) {
        // remove the planet container
        targetTextContainer.destroy();

        // Find and remove the planet associated with the targetTextContainer
        const planet = this.#planets.children.entries.find(
          (planet) =>
            planet.x === targetTextContainer.x &&
            planet.y === targetTextContainer.y
        );
        if (planet) {
          planet.destroy();
        }

        moveMeteorite.call(
          this,
          targetTextContainer.x,
          targetTextContainer.y,
          this.#satellite,
          this.#meteorite
        );

        // update score
        this.#score += 1;
        this.#scoreText.setText(`Score: ${this.#score}`);

        this.#planetsRemoved += 1;
        // every 3 planets removed, increase the falling speed of planets
        if (this.#planetsRemoved % 1 === 0) {
          // increase the falling speed of planets by 30%
          this.#scoreFactor += 0.3;
        }
      }
      const offscreenInput = document.getElementById("offscreen-input");
      offscreenInput.value = "";

      this.#typedWord = "";
    }

    // meteorite animation
    function moveMeteorite(targetX, targetY, satellite, meteorite) {
      // Calculate the angle between the satellite and the target
      let angle = Phaser.Math.Angle.Between(
        satellite.x,
        satellite.y,
        targetX,
        targetY
      );
      // Convert the angle to degrees
      let angleInDegrees = Phaser.Math.RadToDeg(angle);
      // Set the satellite angle
      satellite.setAngle(angleInDegrees + 45); // Update the angle offset to 45 degrees

      // Set the meteorite angle to match the satellite angle
      meteorite.setAngle(angleInDegrees + 135);

      meteorite.visible = true;
      meteorite.setPosition(this.sys.game.config.width / 2, 550);

      this.tweens.add({
        targets: meteorite,
        x: targetX,
        y: targetY,
        duration: 500,
        onComplete: () => {
          meteorite.visible = false;
        },
      });
    }
  }

  update() {
    // this is called up to 60 times per second
    const scoreFactor = this.#scoreFactor;
    if (!this.#gameOver && this.#gameStarted) {
      let planetsToDestroy = []; // array to hold planets that need to be destroyed
      this.#planets.children.iterate(function (planetContainer) {
        // increase falling speed of planets
        planetContainer.y += 0.2 * scoreFactor;
        planetContainer.update(); // Update the text container position

        // check if planet has hit the bottom of the screen
        if (planetContainer.y >= this.sys.game.config.height) {
          planetsToDestroy.push(planetContainer); // add the planet to the destroy list
          this.#score -= 0.5; // deduct one from the score
          this.#scoreText.setText(`Score: ${this.#score}`); // update the score display
        }
      }, this);
      // destroy the planets that need to be destroyed
      planetsToDestroy.forEach(function (planet) {
        planet.destroy();
      });
    } else if (this.#gameOver && !this.#scoreSaved) {
      this.#planets.children.iterate(function (planetContainer) {
        // stop the planets from falling
        planetContainer.y = planetContainer.y;
      });
    }
  }

  // function to update the timer
  updateTimer() {
    if (this.#gameTimeLimit > 0) {
      this.#gameTimeLimit -= 1;
      this.#timer.setText(`Timer: ${this.#gameTimeLimit}`);
    } else {
      this.#gameOver = true;
      this.#planets.clear(true, true); // Remove all planets and text from the scene
      this.saveScore();
      this.time.delayedCall(
        0,
        () => {
          this.gameOverDisplay.call(this);
        },
        null,
        this
      );
    }
  }

  // function to spawn planets
  spawnPlanets() {
    if (!this.#gameOver) {
      const planetKeys = [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
      ];

      // planet related variables (scale, random index, random delay, text, text background)
      const scaleFactors = [1.5, 2, 2, 1.5, 1, 0.8, 1, 1, 1];
      const randomIndex = Math.floor(Math.random() * planetKeys.length);
      const randomX = Math.random() * (this.sys.game.config.width - 100) + 50;
      const randomDelay = Math.random() * 1000 + 1000;
      const planet = this.#planets.create(
        randomX,
        -50,
        planetKeys[randomIndex]
      );
      planet.setScale(scaleFactors[randomIndex]);
      const textStyle = { font: "16px Arial", fill: "#ffffff" };

      // Randomize capitalization of the text
      const randomizedText = this.randomizeTextCapitalization(
        planetKeys[randomIndex]
      );

      const text = this.add.text(0, 0, randomizedText, textStyle);
      text.setOrigin(0.5, 0.5);
      const textBackground = this.add.graphics();
      textBackground.fillStyle(0x000000, 0.8);
      textBackground.fillRect(
        -text.width / 2 - 2,
        -text.height / 2 - 2,
        text.width + 4,
        text.height + 4
      );

      const textContainer = this.add.container(randomX, -50, [
        textBackground,
        text,
      ]);
      // text z-index
      textContainer.depth = 2;
      this.#planets.add(textContainer);

      // Add an update function to update the text container position
      textContainer.update = function () {
        this.x = planet.x;
        this.y = planet.y;
      };

      this.time.addEvent({
        delay: randomDelay,
        callback: this.spawnPlanets,
        callbackScope: this,
      });
    }
  }

  // Randomize capitalization of a string
  randomizeTextCapitalization(text) {
    let randomizedText = text.toLowerCase();

    // select a random position in the text
    const randomPosition = Math.floor(Math.random() * text.length);

    // only capitalize the letter at the random position
    randomizedText =
      randomizedText.slice(0, randomPosition) +
      randomizedText.charAt(randomPosition).toUpperCase() +
      randomizedText.slice(randomPosition + 1);

    return randomizedText;
  }

  // game over display
  gameOverDisplay() {
    if (!this.#gameOverDisplayed) {
      // Add this condition to check if the game over text has been displayed before
      // Display "Game Over" text
      const gameOverText = this.add.text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 - 50,
        "Game Over!",
        { fontSize: "32px", fontStyle: "bold", color: "#FFFFFF" }
      );
      gameOverText.setOrigin(0.5, 0.5);

      this.#gameOverDisplayed = true;

      this.#meteorite.destroy();
      this.#meteorite = null;
      this.#satellite.destroy();
      this.#satellite = null;

      const calledFrom = this.#calledFrom;
      setTimeout(() => {
        this.scene.resume(calledFrom);
        this.scene.stop();
      }, 5000);
    }
  }

  async saveScore() {
    if (!this.#scoreSaved && this.#calledFrom === "GameboardScene") {
      try {
        this.#scoreSaved = true;
        const username = sessionStorage.getItem("username");
        const score = this.#score;
        const response = await fetch("/score/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, score }),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Score saved:", result);
        } else {
          console.warn("Unable to save score:", response);
        }
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
