let socket = io();
// Global scope variable to ensure there is only ever one instance of StateHandler class
let boardgameStateHandlerInstance = null;
// Global scope variable to ensure there is only ever one instance of EventDispatcher class
let boardgameEventDispatcherInstance = null;

/**
 * Main Class orchestrates state update and render flow
 */
class GameboardScene extends Phaser.Scene {
  // Board Handler Class
  #boardHandler;

  // Dice Handler Class
  #diceHandler;

  // Marker Handler Class
  #markerHandler;

  // Minigame Handler Class
  #minigameHandler;

  // Blackhole Handler Class
  #blackholeHandler;

  // Timer Handler Class
  #timerHandler;

  // Score Handler Class
  #scoreHandler;

  // Symbolic Constants
  #WIDTH;
  #HEIGHT;

  constructor() {
    super("MainboardScene");

    this.#WIDTH = DEFAULT_WIDTH;
    this.#HEIGHT = DEFAULT_HEIGHT;

    this.#boardHandler = new BoardHandler(this.#WIDTH, this.#HEIGHT, this.sys);
    this.#diceHandler = new DiceHandler(this.#WIDTH, this.#HEIGHT, this.sys);
    this.#markerHandler = new MarkerHandler(this.sys);
    this.#minigameHandler = new MinigameHandler(this.sys);
    this.#blackholeHandler = new BlackholeHandler(
      this.#WIDTH,
      this.#HEIGHT,
      this.sys
    );
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("finalcompleteboard", "assets/finalcompleteboard.png");
    this.load.image("sun", "assets/sun.png");
    this.load.image("mercury", "assets/mercury.png");
    this.load.image("venus", "assets/venus.png");
    this.load.image("earth", "assets/earth.png");
    this.load.image("mars", "assets/mars.png");
    this.load.image("jupiter", "assets/jupiter.png");
    this.load.image("saturn", "assets/saturn.png");
    this.load.image("uranus", "assets/uranus.png");
    this.load.image("neptune", "assets/neptune.png");
    this.load.image("star", "assets/star.png");
    this.load.image("roll", "assets/roll.png");
    this.load.image("diceone", "assets/diceone.png");
    this.load.image("dicetwo", "assets/dicetwo.png");
    this.load.image("dicethree", "assets/dicethree.png");
    this.load.image("dicefour", "assets/dicefour.png");
    this.load.image("dicefive", "assets/dicefive.png");
    this.load.image("dicesix", "assets/dicesix.png");
    this.load.image("playerone", "assets/playerone.png");
    this.load.image("playertwo", "assets/playertwo.png");
    this.load.image("playerthree", "assets/playerthree.png");
    this.load.image("playerfour", "assets/playerfour.png");
    this.load.image("meteorite", "assets/meteorite.png");
    this.load.image("satellite", "assets/satellite.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("questionBox", "assets/questionBox.png");
  }

  create() {
    // Generate event map for app
    this.#generateEventMap();

    // Phaser groups for sprite access
    const renderer = this.sys;
    renderer.planets = renderer.add.group();
    renderer.stars = renderer.add.group();
    renderer.markers = renderer.add.group();

    // Init board assets + push to Phaser groups
    this.#boardHandler.initializeBoard();

    // Create StateHandler instance + pass to it Phaser groups
    this.stateHandler = BoardStateHandler.getInstance();
    this.stateHandler.initializeBoard(
      renderer.planets.children.entries,
      renderer.stars.children.entries,
      renderer.markers.children.entries
    );
    this.stateHandler.updateBlackholePosition(renderer.stars.children.entries);

    this.#diceHandler.createButton();
  }

  #generateEventMap() {
    this.emitter = BoardEventDispatcher.getInstance();
    this.stateHandler = BoardStateHandler.getInstance();

    this.emitter.addListener("userClicksRoll", (event) => {
      this.stateHandler.updatePlayerPosition(event.diceRoll);
      this.stateHandler.changeTurn();
    });
    this.emitter.addListener("moveUserMarker", (event) => {
      this.#markerHandler.moveMarker(event.currentMarker, event.newPos);
    });
    socket.on("moveUserMarker", (event) => {
      this.#markerHandler.moveMarker(event.currentMarker[0], event.newPos);
      console.log(this);
    });
    this.emitter.addListener("turnComplete", () => {
      this.#diceHandler.createButton();
    });
    this.emitter.addListener("triggerMinigame", () => {
      this.#minigameHandler.renderMinigame();
    });
    this.emitter.addListener("triggerBlackhole", () => {
      const movement = this.#blackholeHandler.calculateMovement();
      this.#blackholeHandler.createIndicator();
      this.stateHandler.updatePlayerPosition(movement);
      this.stateHandler.updateBlackholePosition(
        this.sys.stars.children.entries
      );
      setTimeout(() => {
        this.#blackholeHandler.destroyIndicator();
      }, 1000);
    });
  }
}

/**
 * Class handles the updating of game state as users take actions
 */
class BoardStateHandler {
  #gamePath = [];
  #playerArray = [];

  changeTurn() {
    const currentPlayer = this.#playerArray.filter((player) => {
      return player.isActive === true;
    });
    console.log(currentPlayer[0]);
    const currentIndex = this.#playerArray.indexOf(currentPlayer[0]);
    currentPlayer[0].isActive = false;
    if (currentIndex + 1 === 4) {
      this.#playerArray[0].isActive = true;
    } else {
      this.#playerArray[currentIndex + 1].isActive = true;
    }
    console.log(this.#playerArray[currentIndex + 1]);
  }

  static getInstance = () => {
    if (boardgameStateHandlerInstance === null) {
      boardgameStateHandlerInstance = new BoardStateHandler();
    }
    return boardgameStateHandlerInstance;
  };

  #populateGamePath(planets, stars) {
    const tempPlanets = [...planets];
    const tempStars = [...stars];
    for (let i = 0; i < 27; i++) {
      if (i % 3 === 0) {
        this.#gamePath.push(tempPlanets.shift());
      } else {
        this.#gamePath.push(tempStars.shift());
      }
    }
  }

  #transformGamePathNodes() {
    this.#gamePath.forEach((node) => {
      node["isBlackHole"] = false;
      node["position"] = [node.x, node.y];
    });
  }

  #populatePlayerArray(markers) {
    this.#playerArray = [...markers];
  }

  #transformPlayerArray() {
    this.#playerArray.forEach((marker) => {
      marker["currentPosition"] = this.#gamePath[0];
      marker["score"] = 0;
      marker["isActive"] = false;
    });
  }

  initializeBoard(planets, stars, markers) {
    this.#populateGamePath(planets, stars);
    this.#transformGamePathNodes();
    this.#populatePlayerArray(markers);
    this.#transformPlayerArray();

    // For testing purposes
    this.#playerArray[0].isActive = true;
  }

  #isNewLoop(endPoint) {
    if (endPoint > 26) {
      return true;
    }
    return false;
  }

  #handleLoop(startPoint, value, markerIndex) {
    let tempPosition = startPoint + value;
    if (this.#isNewLoop(tempPosition)) {
      this.updatePlayerScore(markerIndex, 1);
      tempPosition += -27;
    }
    return tempPosition;
  }

  updatePlayerPosition(value) {
    let currentMarker = this.#playerArray.filter((marker) => {
      return marker.isActive === true;
    });
    const markerIndex = this.#playerArray.indexOf(currentMarker[0]);
    const startPoint = this.#gamePath.indexOf(currentMarker[0].currentPosition);
    const endPoint = this.#handleLoop(startPoint, value, markerIndex);

    this.#playerArray[markerIndex].currentPosition = this.#gamePath[endPoint];

    this.emitter = BoardEventDispatcher.getInstance();

    if (currentMarker[0].currentPosition.isBlackHole) {
      this.emitter.emit("triggerBlackhole");
    } else {
      this.emitter.emit("moveUserMarker", {
        currentMarker,
        newPos: this.#playerArray[markerIndex].currentPosition,
      });
      socket.emit("moveUserMarker", {
        currentMarker,
        newPos: this.#playerArray[markerIndex].currentPosition,
      });
    }

    if (currentMarker[0].currentPosition.texture.key !== "star") {
      setTimeout(() => {
        this.emitter.emit("triggerMinigame");
      }, "1800");
    }
  }

  updatePlayerScore(markerIndex, value) {
    this.#playerArray[markerIndex].score += value;
  }

  updateBlackholePosition(starArray) {
    const tempStars = [...starArray];
    this.#gamePath.forEach((node) => {
      node.isBlackHole = false;
    });
    for (let i = 0; i < 4; i++) {
      tempStars.shift();
    }
    const chosenStar = Phaser.Math.RND.pick(tempStars);
    const chosenStarIndex = this.#gamePath.indexOf(chosenStar);
    this.#gamePath[chosenStarIndex].isBlackHole = true;
  }
}

/**
 * Helper class dispatches events so that modules can communicate with each other
 */
class BoardEventDispatcher extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  static getInstance = () => {
    if (boardgameEventDispatcherInstance === null) {
      boardgameEventDispatcherInstance = new BoardEventDispatcher();
    }
    return boardgameEventDispatcherInstance;
  };
}

/**
 * Class handles the rendering of the board and background elements
 */
class BoardHandler {
  // Symbolic Constants
  #HEIGHT;
  #WIDTH;
  #RENDERER;
  #BOARD_POSITIONS = {};

  constructor(width, height, renderer) {
    this.#WIDTH = width;
    this.#HEIGHT = height;
    this.#RENDERER = renderer;
    this.#BOARD_POSITIONS = {
      starPositions: [
        [this.#WIDTH / 2 - 255, this.#HEIGHT / 2 - 75],
        [this.#WIDTH / 2 - 235, this.#HEIGHT / 2 - 95],
        [this.#WIDTH / 2 - 165, this.#HEIGHT / 2 - 133],
        [this.#WIDTH / 2 - 140, this.#HEIGHT / 2 - 142],
        [this.#WIDTH / 2 - 50, this.#HEIGHT / 2 - 160],
        [this.#WIDTH / 2 - 22, this.#HEIGHT / 2 - 163],
        [this.#WIDTH / 2 + 95, this.#HEIGHT / 2 - 157],
        [this.#WIDTH / 2 + 125, this.#HEIGHT / 2 - 151],
        [this.#WIDTH / 2 + 240, this.#HEIGHT / 2 - 108],
        [this.#WIDTH / 2 + 265, this.#HEIGHT / 2 - 90],
        [this.#WIDTH / 2 + 280, this.#HEIGHT / 2 + 60],
        [this.#WIDTH / 2 + 255, this.#HEIGHT / 2 + 80],
        [this.#WIDTH / 2 + 132, this.#HEIGHT / 2 + 135],
        [this.#WIDTH / 2 + 95, this.#HEIGHT / 2 + 142],
        [this.#WIDTH / 2 - 60, this.#HEIGHT / 2 + 142],
        [this.#WIDTH / 2 - 90, this.#HEIGHT / 2 + 137],
        [this.#WIDTH / 2 - 215, this.#HEIGHT / 2 + 90],
        [this.#WIDTH / 2 - 240, this.#HEIGHT / 2 + 73],
      ],
      planetPositions: {
        sun: {
          position: [this.#WIDTH / 2 - 290, this.#HEIGHT / 2 + 10],
          scale: 2.25,
        },
        mercury: {
          position: [this.#WIDTH / 2 - 200, this.#HEIGHT / 2 - 115],
        },
        venus: {
          position: [this.#WIDTH / 2 - 95, this.#HEIGHT / 2 - 155],
        },
        earth: {
          position: [this.#WIDTH / 2 + 35, this.#HEIGHT / 2 - 170],
        },
        mars: {
          position: [this.#WIDTH / 2 + 185, this.#HEIGHT / 2 - 140],
        },
        jupiter: {
          position: [this.#WIDTH / 2 + 305, this.#HEIGHT / 2 - 25],
          scale: 1.3,
        },
        saturn: {
          position: [this.#WIDTH / 2 + 200, this.#HEIGHT / 2 + 110],
        },
        uranus: {
          position: [this.#WIDTH / 2 + 15, this.#HEIGHT / 2 + 145],
        },
        neptune: {
          position: [this.#WIDTH / 2 - 155, this.#HEIGHT / 2 + 120],
        },
      },
      UIPositions: {
        centerScreen: [this.#WIDTH / 2, this.#HEIGHT / 2],
        fullscreenOption: [this.#WIDTH / 1.15, this.#HEIGHT / 1.2],
        playerOne: [this.#WIDTH / 2 - 335, this.#HEIGHT / 2 - 220],
        playerTwo: [this.#WIDTH / 2 + 335, this.#HEIGHT / 2 - 220],
        playerThree: [this.#WIDTH / 2 - 335, this.#HEIGHT / 2 + 220],
        playerFour: [this.#WIDTH / 2 + 335, this.#HEIGHT / 2 + 220],
      },
    };
  }

  #createSprite(x, y, spriteName, scaleValue) {
    return this.#RENDERER.add
      .sprite(x, y, spriteName)
      .setScale(scaleValue, scaleValue);
  }

  #createText(x, y, textContent) {
    return this.#RENDERER.add.text(x, y, textContent);
  }

  #renderBackground() {
    const centerScreen = this.#BOARD_POSITIONS.UIPositions.centerScreen;
    this.#createSprite(centerScreen[0], centerScreen[1], "background", 1.3);
  }

  #renderBoardAsset() {
    const centerScreen = this.#BOARD_POSITIONS.UIPositions.centerScreen;
    this.#createSprite(
      centerScreen[0],
      centerScreen[1],
      "finalcompleteboard",
      1.5
    );
  }

  #renderPlanetNodes() {
    const allPlanets = Object.keys(this.#BOARD_POSITIONS.planetPositions);

    allPlanets.forEach((planet) => {
      const planetInfo = this.#BOARD_POSITIONS.planetPositions[planet];
      const planetScale = planetInfo.scale ?? 1.5;
      const currentPlanet = this.#createSprite(
        planetInfo.position[0],
        planetInfo.position[1],
        planet,
        planetScale
      );
      if (planet === "saturn") {
        currentPlanet.setAngle(35);
      }
      this.#RENDERER.planets.children.entries.push(currentPlanet);
    });
  }

  #renderStarNodes() {
    this.#BOARD_POSITIONS.starPositions.forEach((position) => {
      const currentStar = this.#createSprite(
        position[0],
        position[1],
        "star",
        1
      );
      this.#RENDERER.stars.children.entries.push(currentStar);
    });
  }

  #renderPlayerMarkers() {
    const spriteNames = ["playerone", "playertwo", "playerthree", "playerfour"];

    spriteNames.forEach((sprite) => {
      const sunPosition = this.#BOARD_POSITIONS.planetPositions.sun.position;
      const currentMarker = this.#createSprite(
        sunPosition[0],
        sunPosition[1],
        sprite,
        1
      );
      this.#RENDERER.markers.children.entries.push(currentMarker);
    });
  }

  #renderOptions() {
    const fullscreen = this.#createText(
      this.#WIDTH / 1.15,
      this.#HEIGHT / 1.2,
      "Fullscreen"
    );
    fullscreen.setInteractive();
  }

  #renderPlayerLeaderboard() {
    const spriteNames = ["playerone", "playertwo", "playerthree", "playerfour"];
    const playerUIPositions = {
      playerone: this.#BOARD_POSITIONS.UIPositions.playerOne,
      playertwo: this.#BOARD_POSITIONS.UIPositions.playerTwo,
      playerthree: this.#BOARD_POSITIONS.UIPositions.playerThree,
      playerfour: this.#BOARD_POSITIONS.UIPositions.playerFour,
    };

    for (let i = 0; i < spriteNames.length; i++) {
      const currentPlayer = spriteNames[i];
      const sprite = this.#createSprite(
        playerUIPositions[currentPlayer][0],
        playerUIPositions[currentPlayer][1],
        currentPlayer,
        2
      );
      this.#createText(
        sprite.x - sprite.width / 2 - 25,
        sprite.y - sprite.height / 2 + 50,
        currentPlayer.replace("r", "r "),
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      );
      this.#createText(
        sprite.x - sprite.width / 2 - 25,
        sprite.y - sprite.height / 2 + 70,
        "Fuel:",
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      );
    }
  }

  #renderBackgroundUI() {
    this.#renderOptions();
    this.#renderPlayerLeaderboard();
  }

  initializeBoard() {
    this.#renderBackground();
    this.#renderBoardAsset();
    this.#renderPlanetNodes();
    this.#renderStarNodes();
    this.#renderPlayerMarkers();
    this.#renderBackgroundUI();
  }
}

/**
 * Class handles the rendering and random calculation of dice rolls
 */
class DiceHandler {
  // Symbolic Constants
  #HEIGHT;
  #WIDTH;
  #RENDERER;

  constructor(width, height, renderer) {
    this.#HEIGHT = height;
    this.#WIDTH = width;
    this.#RENDERER = renderer;
  }

  #createSprite(spriteName, scaleValue) {
    return this.#RENDERER.add
      .sprite(this.#WIDTH / 2, this.#HEIGHT / 2, spriteName)
      .setScale(scaleValue, scaleValue);
  }

  #addEventListener() {
    this.button.on("pointerdown", () => {
      this.button.destroy();
      this.rollDice();
    });
  }

  createButton() {
    this.button = this.#createSprite("roll", 1.25);
    this.button.setInteractive();
    this.#addEventListener();
  }

  createDicePlaceholder() {
    const dice = this.#createSprite("dicesix", 1.5);
    return dice;
  }

  #randomizeDiceFace() {
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

  #getDiceNumberFromFace(diceFace) {
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

  #startRollAnimation() {
    const animation = this.#RENDERER.time.addEvent({
      delay: 100,
      callback: this.#randomizeDiceFace,
      callbackScope: this,
      loop: true,
    });
    return animation;
  }

  #stopRollAnimation(animation) {
    animation.remove();
    return this.#getDiceNumberFromFace(this.dice.texture.key);
  }

  #emitUserClicksRoll() {
    this.emitter = BoardEventDispatcher.getInstance();
    this.emitter.emit("userClicksRoll", {
      diceRoll: this.outputValue,
    });
  }

  rollDice() {
    this.dice = this.createDicePlaceholder();
    const animation = this.#startRollAnimation();
    this.#RENDERER.time.delayedCall(2000, () => {
      this.outputValue = this.#stopRollAnimation(animation);
    });
    this.#RENDERER.time.delayedCall(2800, () => {
      this.#emitUserClicksRoll();
      this.dice.destroy();
    });
  }
}

/**
 * Class handles the rendering and updating of marker position on the board
 */
class MarkerHandler {
  #RENDERER;

  constructor(renderer) {
    this.#RENDERER = renderer;
  }

  moveMarker(marker, newPosition) {
    this.#RENDERER.tweens.add({
      targets: marker[0],
      x: newPosition.x,
      y: newPosition.y,
      duration: 1000,
      onComplete: () => {
        // Idk some shit to change turn w sockets etc

        // Temp insert for further testing + prod
        this.emitter = BoardEventDispatcher.getInstance();
        this.emitter.emit("turnComplete");
      },
    });
  }
}

/**
 * Class handles minigame trigger and random selection of minigame
 */
class MinigameHandler {
  #SCENE_LIST = [
    "MemoryGameScene",
    "WordScene",
    "MeteorShowerScene",
    "TriviaScene",
  ];
  #RENDERER;

  constructor(renderer) {
    this.#RENDERER = renderer;
  }

  #chooseMinigame() {
    const chosenGame = Phaser.Math.RND.pick(this.#SCENE_LIST);
    return chosenGame;
  }

  renderMinigame() {
    const chosenGame = this.#chooseMinigame();
    this.#RENDERER.game.scene.start(chosenGame);
  }
}

/**
 * Class handled blackhole's random movement calculation
 */
class BlackholeHandler {
  #VALUES = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  #RENDERER;
  #WIDTH;
  #HEIGHT;

  constructor(width, height, renderer) {
    this.#WIDTH = width;
    this.#HEIGHT = height;
    this.#RENDERER = renderer;
  }

  #createSprite(spriteName, scaleValueWidth, scaleValueHeight) {
    return this.#RENDERER.add
      .sprite(this.#WIDTH / 2, this.#HEIGHT / 2, spriteName)
      .setScale(scaleValueWidth, scaleValueHeight);
  }

  #createText(x, y, textContent) {
    return this.#RENDERER.add.text(x, y, textContent);
  }

  createIndicator() {
    this.box = this.#createSprite("questionBox", 1.4, 2.5);
    this.text = this.#createText(
      this.#WIDTH / 2 - 80,
      this.#HEIGHT / 2 - 10,
      "WORMHOLE!",
      {
        fontSize: "18px",
        fill: "#ffffff",
      }
    ).setScale(2, 2);
  }

  destroyIndicator() {
    this.box.destroy();
    this.text.destroy();
  }

  calculateMovement() {
    const chosenMovement = Phaser.Math.RND.pick(this.#VALUES);
    return chosenMovement;
  }
}

/**
 * Class handles timing logic and rendering
 */
class TimerHandler {}

/**
 * Class handles scoring logic and rendering
 */
class ScoreHandler {}
