class MeteorShowerScene extends Phaser.Scene {
  // universal variables
  #timeLimit = 30;

  #gameOver = false;
  #score = 0;
  #scoreModifier = 0;
  #shipSpeed = 240;
  #time;
  #centerOfGravityLocation = {};
  #endingDelay = 2000;
  #shipVelocity = { x: 0, y: 0 };
  #scoreSaved = false;
  #cursors;
  #calledFrom;

  constructor() {
    super("MeteorShowerScene");
  }

  init(data) {
    const { source } = data;
    this.#calledFrom = source;
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startingPoint", "assets/mercury.png");
    this.load.image("ship", "assets/player3.png");
    this.load.image("meteorite", "assets/meteorite.png");
    this.load.image("star", "assets/star.png");
    this.load.image("comet", "assets/comet.png");
    this.load.image("blackHole", "assets/board.png");
    this.load.image("arrow", "assets/arrowIcon.png");
  }

  create() {
    // define width and height the game
    this.WIDTH = this.sys.game.config.width;
    this.HEIGHT = this.sys.game.config.height;

    // place the background image
    this.bg = this.add
      .sprite(0, 0, "background")
      .setPosition(this.WIDTH / 2, this.HEIGHT / 2);

    // place score inidcator in top left corner, on top of background
    this.scoreText = this.add.text(0, 0, `Score: ${this.#score}`);
    this.scoreText.depth = 2;

    // place timer in top right corner
    this.timerText = this.add.text(
      this.sys.game.config.width - 90,
      0,
      `Timer: ${this.#timeLimit}`
    );
    this.timerText.depth = 2;

    // create sprite groups
    this.meteorites = this.physics.add.group();
    this.stars = this.physics.add.group();
    this.comets = this.physics.add.group();
    this.blackHoles = this.physics.add.group();
    // this.hpBar = this.physics.add.group();

    // create events

    // countdown timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.countdown(this.timerText);
      },
    });

    // spawn sprites
    this.meteoriteSpawnerEvent = this.createEvent(170, () => {
      this.spawn(
        "meteorite",
        "meteorites",
        this.getRandomSpeed(2, 6),
        this.sys.game.config.width
      );
    });

    this.cometSpawnerEvent = this.createEvent(1200, () => {
      this.spawn("comet", "comets", 10, this.sys.game.config.width);
    });

    this.starSpawnerEvent = this.createEvent(170, () => {
      this.spawn("star", "stars", this.getRandomSpeed(-2, -6), 0);
    });

    this.blackHoleSpawnerEvent = this.createEvent(5000, () => {
      this.spawn("blackHole", "blackHoles", -4, 0, 0.2);
    });

    // place the spawn point for the ship
    this.startingPoint = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.width / 2 - 50,
        "startingPoint"
      )
      .setScale(4);

    // place the ship
    this.ship = this.placeShip();

    // initialize the variables for the game
    this.initializeValues(this.ship);

    // place the arrow pad
    const ARROW_CONFIGS = [
      { direction: "up", x: this.WIDTH - 70, y: this.HEIGHT - 150 },
      { direction: "right", x: this.WIDTH - 25, y: this.HEIGHT - 105, a: 90 },
      { direction: "left", x: this.WIDTH - 115, y: this.HEIGHT - 105, a: -90 },
      { direction: "down", x: this.WIDTH - 70, y: this.HEIGHT - 60, a: 180 },
    ];
    this.arrowPad = this.placeArrows(ARROW_CONFIGS);

    // decrease score and destroy meteorite upon ship-metoerite collision
    this.physics.add.collider(this.ship, this.meteorites, (ship, meteorite) => {
      meteorite.destroy();
      // this.#scoreModifier -= 2;
      this.updateScore(this.scoreText, -2);
      this.displayTip(
        meteorite.x + 40,
        meteorite.y,
        "meteorMessage",
        "-2 points from meteor"
      );
    });

    // slow down ship and reduce hp upon comet-ship collision
    this.physics.add.collider(this.ship, this.comets, (ship, comet) => {
      comet.destroy();
      this.slowDownShip(ship);
      setTimeout(() => {
        ship.speed = this.#shipSpeed;
      }, 3000);
      // this.displayTip(
      //   comet.x,
      //   comet.y - 60,
      //   "cometHPMessage",
      //   "-1 HP from comet"
      // );
      this.displayTip(
        comet.x,
        comet.y - 30,
        "cometSpeedMessage",
        "Comets slow down the ship"
      );
    });

    // Increase score upon star-ship collision
    this.physics.add.collider(this.ship, this.stars, (ship, star) => {
      star.destroy();
      // this.#scoreModifier += 2;
      this.updateScore(this.scoreText, 2);
      this.displayTip(
        this,
        star.x - 180,
        star.y,
        "starMessage",
        "+2 points from star"
      );
    });

    this.physics.add.collider(this.ship, this.blackHoles, (ship, blackHole) => {
      blackHole.fixed = true;
      blackHole.moves = false;
      blackHole.body.enable = false;
      this.createCenterOfGravity(blackHole);
    });

    this.#cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // create an array of all sprites on the screen
    const spriteGroups = [
      this.meteorites.getChildren(),
      this.comets.getChildren(),
      this.stars.getChildren(),
      this.blackHoles.getChildren(),
    ];

    // move the sprites unless the game is over
    this.moveOrDestroySprites(spriteGroups);

    // set the ship's velocity or stop the ship if it collides with the border
    this.moveOrStopShip(this.ship);

    // check if the ship has lost hp and update hp bar
    // this.updateHp(this.ship, this.hpBar);

    // check if black hole has been struck
    this.handleBlackHoleCollision(
      this.meteorites,
      this.comets,
      this.stars,
      this.blackHoles,
      this.ship
    );

    if (this.#time === 0) {
      this.#gameOver = true;
      this.displayGameOver();
      this.#score = 0;
      if (this.#calledFrom === "GameboardScene") {
        this.saveScore();
      }
      const calledFrom = this.#calledFrom;
      setTimeout(() => {
        this.scene.resume(calledFrom);
        this.scene.stop();
      }, 5000);
    } else if (this.ship) {
      this.moveShipWithKeys(this.ship, this.input.activePointer.isDown);
      this.moveShipOnClick(this.ship, this.arrowPad);
    }
  }

  createEvent(delay, callback) {
    const event = this.time.addEvent({
      delay,
      loop: true,
      callback,
    });
  }

  countdown(timer) {
    if (!this.#gameOver) {
      this.#time--;
    }
    timer.setText(`Timer: ${this.#time}`);
  }

  spawn(spriteName, group, movementSpeed, startX, scale) {
    const randomY = Phaser.Math.Between(40, this.HEIGHT - 60);
    if (!this.#gameOver) {
      const sprite = this.add.sprite(startX, randomY, spriteName);
      sprite.speed = movementSpeed;
      this[group].add(sprite);
      if (scale) {
        sprite.setScale(scale);
      }
    }
  }

  getRandomSpeed(lowest, highest) {
    return Phaser.Math.Between(lowest, highest);
  }

  placeShip() {
    const ship = this.physics.add.sprite(
      this.WIDTH / 2,
      this.HEIGHT - 125,
      "ship"
    );
    ship.depth = 2;
    // ship.hp = 4;
    return ship;
  }

  initializeValues(ship) {
    this.#gameOver = false;
    this.#score = 0;
    this.#centerOfGravityLocation = null;
    this.#time = this.#timeLimit;
    this.#shipVelocity = { x: 0, y: 0 };
    ship.speed = this.#shipSpeed;
  }

  placeArrows(ARROW_CONFIGS) {
    const arrows = ARROW_CONFIGS.map((config) => {
      const arrow = this.add.sprite(config.x, config.y, "arrow");
      arrow.direction = config.direction;
      if (config.a) {
        arrow.angle = config.a;
      }
      arrow.setScale(5);
      arrow.setInteractive();
      return arrow;
    });
    return arrows;
  }

  updateScore(scoreText, modifier) {
    this.#score += modifier;
    const currentScore = this.#score;
    scoreText.setText(`Score: ${currentScore}`);
  }

  displayTip(x, y, messageName, messageContent) {
    if (!this[messageName]) {
      this[messageName] = this.add.text(x, y, messageContent);
    }
    this[messageName].depth = 2;
    setTimeout(() => {
      this[messageName].setText("");
    }, 4000);
  }

  slowDownShip(ship) {
    ship.speed /= 2;
    // ship.hp -= 1;
  }

  createCenterOfGravity(blackHole) {
    const x = blackHole.x;
    const y = blackHole.y;

    this.#centerOfGravityLocation = { x, y };
  }

  moveOrDestroySprites(spriteGroups) {
    if (spriteGroups && !this.#centerOfGravityLocation) {
      spriteGroups.forEach((group) => {
        group.forEach((sprite) => {
          this.moveSprite(sprite);
          if (this.#gameOver) {
            sprite.destroy();
          }
        });
      });
    }
  }

  moveSprite(sprite) {
    let newX = sprite.x - sprite.speed;
    sprite.x = newX;
  }

  moveOrStopShip(ship) {
    if (this.#gameOver) {
      this.stopShip();
    }
    ship.setVelocityX(this.#shipVelocity.x);
    ship.setVelocityY(this.#shipVelocity.y);
    const buffer = ship.width / 2;
    if (ship.x <= 0 + buffer) {
      this.stopShip();
      ship.x += 1;
    } else if (ship.x >= 800 - buffer) {
      this.stopShip();
      ship.x -= 1;
    } else if (ship.y <= 0 + buffer) {
      this.stopShip();
      ship.y += 1;
    } else if (ship.y >= 490) {
      this.stopShip();
      ship.y -= 1;
    }
  }

  // updateHp(ship, hpBar) {
  // if (hpBar.getChildren()) {
  //   hpBar.getChildren().forEach((hpIcon) => {
  //     hpIcon.destroy();
  //   });
  // }
  // let shipHp = ship.hp;
  // for (let i = 0; i < shipHp; i++) {
  //   this.displayHp(ship, hpBar, i);
  // }
  // }

  // displayHp = function (ship, hpBar, i) {
  //   let hpToRender = this.add.sprite(ship.width / 2 + i * 30, 580, "ship");
  //   hpBar.add(hpToRender);
  // };

  handleBlackHoleCollision(meteorites, comets, stars, blackHoles, ship) {
    // check if black hole was struck
    if (this.#centerOfGravityLocation) {
      // stop comets from spawning
      comets.getChildren().forEach((comet) => comet.destroy());

      // stop more blackholes from spawning
      blackHoles.getChildren().forEach((blackHole) => {
        if (blackHole.x !== this.#centerOfGravityLocation.x) {
          blackHole.destroy();
        }
      });
      const spriteGroups = [
        meteorites.getChildren(),
        comets.getChildren(),
        stars.getChildren(),
      ];
      if (!this.#gameOver) {
        ship.depth = -1;
        this.pullToCenter(ship);
        spriteGroups.forEach((group) => {
          group.forEach((sprite) => {
            this.pullToCenter(sprite);
          });
        });
      }
    }
  }

  pullToCenter(sprite) {
    const angle = Phaser.Math.Angle.Between(
      sprite.x,
      sprite.y,
      this.#centerOfGravityLocation.x,
      this.#centerOfGravityLocation.y
    );
    const velocity = 10;
    sprite.x += velocity * Math.cos(angle);
    sprite.y += velocity * Math.sin(angle);
  }

  displayGameOver() {
    this.gameOverText = this.add
      .text(this.WIDTH / 2, this.HEIGHT / 2, "Game Over")
      .setOrigin(0.5)
      .setScale(2);
    this.gameOverText.depth = 2;
  }

  moveShipWithKeys(ship, mouseIsDown) {
    const shipAngle = ship.angle;
    const speed = ship.speed;
    if (this.#cursors.right.isDown) {
      if (this.ship.x < this.WIDTH) {
        this.moveShipRight(ship, speed, shipAngle);
      } else {
        this.ship.x = this.ship.x - 1;
      }
    } else if (this.#cursors.left.isDown) {
      if (this.ship.x > 0) {
        this.moveShipLeft(ship, speed, shipAngle);
      } else {
        this.ship.x = this.ship.x + 1;
      }
    } else if (this.#cursors.up.isDown) {
      if (this.ship.y > 0) {
        this.moveShipUp(ship, speed);
      } else {
        this.ship.y = this.ship.y + 1;
      }
    } else if (this.#cursors.down.isDown) {
      if (this.ship.y < this.HEIGHT) {
        this.moveShipDown(ship, speed);
      } else {
        this.ship.y = this.ship.y - 1;
      }
    } else if (
      this.#cursors.right.isUp &&
      this.#cursors.left.isUp &&
      this.#cursors.up.isUp &&
      !mouseIsDown
    ) {
      this.stopShip();
    }
  }

  moveShipOnClick(ship, arrowPad) {
    arrowPad.forEach((arrow) => {
      if (arrow.direction === "right") {
        arrow.on("pointerdown", () => {
          this.moveShipRight(ship, ship.speed, ship.angle);
        });
      } else if (arrow.direction === "left") {
        arrow.on("pointerdown", () => {
          this.moveShipLeft(ship, ship.speed, ship.angle);
        });
      } else if (arrow.direction === "up") {
        arrow.on("pointerdown", () => {
          this.moveShipUp(ship, ship.speed);
        });
      } else if (arrow.direction === "down") {
        arrow.on("pointerdown", () => {
          this.moveShipDown(ship, ship.speed);
        });
      }
      arrow.on("pointerup", () => {
        this.stopShip();
      });
    });
  }

  stopShip() {
    this.#shipVelocity = { x: 0, y: 0 };
  }

  moveShipRight(ship, speed, shipAngle) {
    this.#shipVelocity.x = speed;
    if (shipAngle === 180 || shipAngle === -135 || shipAngle === 135) {
      ship.angle = 135;
    } else {
      ship.angle = 45;
    }
  }

  moveShipLeft(ship, speed, shipAngle) {
    this.#shipVelocity.x = -speed;
    if (shipAngle === 180 || shipAngle === -135 || shipAngle === 135) {
      ship.angle = -135;
    } else {
      ship.angle = -45;
    }
  }

  moveShipUp(ship, speed) {
    this.#shipVelocity.y = -speed;
    ship.angle = 0;
    60;
  }

  moveShipDown(ship, speed) {
    this.#shipVelocity.y = speed;
    ship.angle = 180;
  }

  async saveScore() {
    if (!this.#scoreSaved) {
      try {
        this.#scoreSaved = true;
        const username = document.cookie.split("=")[1];
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
