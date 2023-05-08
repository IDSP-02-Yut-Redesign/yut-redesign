const endPoint = -15;
const startingScore = 50;

let gameOverMeteor = false;
let timerMeteor;
let gameTimeLimitMeteor = 15;
let scoreMeteor;
let scoreTextMeteor;
let scoreDeductionMeteor = 0;
let centerOfGravityLocation;
let cursors;
let _thisMeteor;

/**
 * Calculates score and updates text
 */
const updateScoreMeteor = () => {
  score = startingScore - scoreDeductionMeteor;
  scoreText.setText(`Score: ${score}`);
};

/**
 * Defines point where all sprites will be drawn towards as xy coordinates of struck black hole
 * @param {Sprite} blackHole black hole sprite that the ship collided with
 */
const createCenterOfGravity = (blackHole) => {
  let x = blackHole.x;
  let y = blackHole.y;

  centerOfGravityLocation = { x, y };
};

class MeteorShowerScene extends Phaser.Scene {
  gameOver = "hi";

  
  constructor() {
    super("MeteorShowerScene");
    this
  }

  preload() {
    _this = this;
    this.load.image("background", "assets/background.png");
    this.load.image("startingPoint", "assets/startingPoint.png");
    this.load.image("ship", "assets/player3.png");
    this.load.image("meteorite", "assets/meteorite.png");
    this.load.image("star", "assets/star.png");
    this.load.image("comet", "assets/comet.png");
    this.load.image("blackHole", "assets/board.png");
  }

  create() {
    // Create background and position it in the middle of the Scene
    const bg = this.add.sprite(0, 0, "background");
    bg.setPosition(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2
    );

    // Initialize score as 0 in the top left corner
    scoreText = this.add.text(0, 0, `Score: ${startingScore}`);

    // Initialize game timer as 60 seconds in the top right corner
    timer = this.add.text(710, 0, `Timer: ${gameTimeLimit}`);
    timer.depth = 1;

    this.meteorites = this.physics.add.group();

    this.stars = this.physics.add.group();

    this.comets = this.physics.add.group();

    this.blackHoles = this.physics.add.group();

    this.hpDisplay = this.add.group();

    // Add event to decrease the game timer every second
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.countdown,
      callbackScope: this,
    });

    // Add events to spawn objects
    this.meteoriteSpawnerEvent = this.createEvent(150, () => {
      this.spawn("meteorite", "meteorites", 800);
    });
    this.cometSpawnerEvent = this.createEvent(500, () => {
      this.spawn("comet", "comets", 800);
    });
    this.starSpawnerEvent = this.createEvent(150, () => {
      this.spawn("star", "stars", 0);
    });
    this.blackHoleSpawnerEvent = this.createEvent(3000, () => {
      this.spawn("blackHole", "blackHoles", 0, 0.2);
    });

    // Create the planet where the ship spawns
    this.startingPoint = this.add.sprite(400, 530, "startingPoint");
    this.startingPoint.setScale(4);
    this.startingPoint.depth = 1;

    // Create the ship that the player controls
    this.ship = this.physics.add.sprite(400, 475, "ship");
    this.ship.depth = 2;
    this.ship.speed = 3;
    this.ship.hp = 4;

    // Create hp icons in the bottom left corner
    for (let i = 0; i < this.ship.hp; i++) {
      let hp = this.add.sprite(this.ship.width / 2 + i * 30, 580, "ship");
      this.hpDisplay.add(hp);
    }

    // Decrease score and destroy meteorite upon ship-metoerite collision
    this.physics.add.collider(
      this.ship,
      this.meteorites,
      function (ship, meteorite) {
        meteorite.destroy();
        scoreDeductionMeteor += 2;
        updateScoreMeteor();
      }
    );

    // Slow down ship upon comet-ship collision
    this.physics.add.collider(this.ship, this.comets, function (ship, comet) {
      comet.destroy();
      _this.slowDownShip();
    });

    // Increase score upon star-ship collision
    this.physics.add.collider(this.ship, this.stars, function (ship, star) {
      star.destroy();
      scoreDeductionMeteor -= 1;
      updateScoreMeteor();
    });

    this.physics.add.collider(
      this.ship,
      this.blackHoles,
      function (ship, blackHole) {
        blackHole.fixed = true;
        createCenterOfGravity(blackHole);
      }
    );

    // Assign cursor keys (up, down, left, right) object to cursors variable
    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const meteorites = this.meteorites.getChildren();
    const comets = this.comets.getChildren();
    const stars = this.stars.getChildren();
    const blackHoles = this.blackHoles.getChildren();
    const ship = this.ship;

    const spriteGroups = [meteorites, comets, stars];

    if (this.ship.y < endPoint || gameTimeLimit === 0 || ship.hp < 1) {
      this.displayGameOver();
      spriteGroups.push(blackHoles);
      this.destroyAll(spriteGroups);
    } else {
      this.handleShipMovement();
    }

    this.moveSprites();

    this.updateHp();

    if (centerOfGravityLocation) {
      // Check if black hole was struck
      // Stop comets from spawning
      comets.forEach((comet) => comet.destroy());
      // Stop more blackholes from spawning
      blackHoles.forEach((blackHole) => {
        if (blackHole.x < centerOfGravityLocation.x) {
          blackHole.destroy();
        }
      });
      this.handleBlackHoleCollision(
        ship,
        spriteGroups,
        centerOfGravityLocation
      );
    }
  }

  /**
   * Triggers specfied callback on given time interval
   * @param {number} delay time interval
   * @param {callback} callback function that gets called
   */
  createEvent(delay, callback) {
    const event = this.time.addEvent({
      delay: delay,
      loop: true,
      callback: callback,
      callbackScope: this,
    });
  }

  /**
   * Handles movement for all sprites
   */
  moveSprites() {
    this.meteorites.getChildren().forEach((meteorite) => {
      this.moveSprite(meteorite, 4);
    });

    this.comets.getChildren().forEach((comet) => {
      this.moveSprite(comet, 10);
    });

    this.stars.getChildren().forEach((star) => {
      this.moveSprite(star, -4);
    });

    this.blackHoles.getChildren().forEach((blackHole) => {
      if (!blackHole.fixed) {
        this.moveSprite(blackHole, -4);
      }
    });
  }

  /**
   * Moves ship and changes its angle on arrow key press
   */
  handleShipMovement() {
    const shipAngle = this.ship.angle;
    const shipX = this.ship.x;
    const shipY = this.ship.y;
    const shipSpeed = this.ship.speed;
    const shipWidth = this.ship.width;
    const gameWidth = this.sys.game.config.width;
    if (cursors.right.isDown) {
      if (shipX < gameWidth - shipWidth / 2) {
        this.ship.x += shipSpeed;
        if (shipAngle === 180 || shipAngle === -135 || shipAngle === 135) {
          this.ship.angle = 135;
        } else {
          this.ship.angle = 45;
        }
      }
    }
    if (cursors.left.isDown) {
      if (shipX > 0 + shipWidth / 2) {
        this.ship.x -= shipSpeed;
        if (shipAngle === 180 || shipAngle === -135 || shipAngle === 135) {
          this.ship.angle = -135;
        } else {
          this.ship.angle = -45;
        }
      }
    }
    if (cursors.up.isDown) {
      this.ship.y -= shipSpeed;
      this.ship.angle = 0;
    }
    if (cursors.down.isDown) {
      if (shipY < 470) {
        this.ship.y += shipSpeed;
        this.ship.angle = 180;
      }
    }
  }

  /**
   * Updates bottom-left HP icons when HP decreases
   */
  updateHp() {
    const hpOnScreen = this.hpDisplay.getChildren().length;
    if (hpOnScreen > this.ship.hp) {
      let usedHp = this.hpDisplay.getChildren()[hpOnScreen - 1];
      usedHp.destroy();
    }
  }

  /**
   * Spaws sprite in this
   * @param {string} spriteName name of preloaded sprite
   * @param {string} group name for the group of sprites
   * @param {number} startX x coordinate where sprite spawns
   * @param {number} scale optional multiplier for sprite size
   */
  spawn(spriteName, group, startX, scale) {
    const sprite = this.add.sprite(
      startX,
      Phaser.Math.Between(0, 600),
      `${spriteName}`
    );
    if (scale) {
      sprite.setScale(scale);
    }
    this[group].add(sprite);
  }

  /**
   * Moves sprite across this
   * @param {Sprite} sprite Phaser Sprite class
   * @param {number} distance Number of pixels to move (pos. value for left, neg. value for right)
   */
  moveSprite(sprite, distance) {
    let newX = sprite.x - distance;
    sprite.x = newX;
    if (sprite.x === 0) {
      sprite.destroy();
    }
  }

  /**
   * Calls the pullToCenter function on each sprite on the screen
   * @param {Sprite} ship ship sprite
   * @param {Group[]} spriteGroups array of all groups of sprites
   * @param {{x: number, y: number}} centerOfGravity xy coordinates that sprites are pulled towards
   */
  handleBlackHoleCollision(ship, spriteGroups, centerOfGravity) {
    if (!gameOver) {
      ship.depth = -1;
      this.pullToCenter(ship, centerOfGravity);
      spriteGroups.forEach((group) => {
        group.forEach((sprite) => {
          this.pullToCenter(sprite, centerOfGravity);
        });
      });
    }
  }

  /**
   * Moves sprite towards the center of gravity
   * @param {Sprite} sprite phaser sprite
   * @param {{x: number, y: number}} centerOfGravity xy coordinates that sprites are pulled towards
   */
  pullToCenter(sprite, centerOfGravity) {
    const angle = Phaser.Math.Angle.Between(
      sprite.x,
      sprite.y,
      centerOfGravity.x,
      centerOfGravity.y
    );
    const velocity = 10;
    sprite.x += velocity * Math.cos(angle);
    sprite.y += velocity * Math.sin(angle);
  }

  /**
   * Displays game over text on the screen
   */
  displayGameOver() {
    gameOver = true;
    const gameOverText = this.add.text(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "Game Over"
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setScale(2);
  }

  /**
   * Destroys every sprite in each group
   * @param {Group[]} groups
   */
  destroyAll(groups) {
    groups.forEach((group) => {
      group.forEach((sprite) => {
        sprite.destroy();
      });
    });
  }

  /**
   * Decreases the timer by 1 every second
   */
  countdown() {
    if (gameTimeLimit > 0) {
      gameTimeLimit--;
    }
    timer.setText(`Timer: ${gameTimeLimit}`);
  }

  /**
   * Halves ship speed and reduces HP by 1
   */
  slowDownShip() {
    this.ship.speed /= 2;
    this.ship.hp -= 1;
  }
}