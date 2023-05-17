// Global scope variable to ensure there is only ever one instance of StateHandler class
let gameboardStateHandlerInstance = null;
// Global scope variable to ensure there is only ever one instance of EventDispatcher class
let gameboardEventDispatcherInstance = null;

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

    // Blackhole Handler class
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

        this.#WIDTH = DEFAULT_HEIGHT;
        this.#HEIGHT = DEFAULT_WIDTH;

        this.#boardHandler = new BoardHandler (this.#WIDTH, this.#HEIGHT, this.sys);
    };

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
        // this.load.image("meteorite", "assets/meteorite.png");
        // this.load.image("satellite", "assets/satellite.png");
        // this.load.image("startButton", "assets/startButton.png");
    };

    create () {
        // Phaser Groups for Sprite Access
        this.sys.planets = this.sys.add.group();
        this.sys.stars = this.sys.add.group();
        this.sys.markers = this.sys.add.group();

        // Board Init Functionality
        this.#boardHandler.initializeBoard();
        console.log(this);
    };
};

/**
 * Class handles the updating of game state as users take actions
 */
class BoardStateHandler {
    #gamePath = [];
    #playerArray = [];

    static getInstance = () => {
        if (boardgameStateHandlerInstance === null) {
          boardgameStateHandlerInstance = new StateHandler();
        }
        return boardgameStateHandlerInstance;
    };

    initializeBoard () {
        // Recieves sprite class instance for everything made in create() except background pieces
        // Pushes sprites into either gamePath or playerArray
        // gamePath sprites given extra key isBlackhole: false
        // playerArray sprites given following additional keys
            // name: playerNameString
            // score: playerNameScore
            // position: Sprite Class marker is currently on
    };

    updatePlayerPosition() {
        // Update position key in playerArray for relevant player on player movement
    };

    updatePlayerScore() {
        // Update score key in playerArray for relevant player on minigame or rotation completion
    };

    updateBlackholePosition() {
        // Update blackhole position when blackhole regenerated
    };
};

/**
 * Helper class dispatches events so that modules can communicate with each other
 */
class BoardEventDispatcher {
    static getInstance = () => {
        if (boardgameEventDispatcherInstance === null) {
          boardgameEventDispatcherInstance = new EventDispatcher();
        }
        return boardgameEventDispatcherInstance;
    };

    socketEmit () {
        // Emit custom event using socket
    };

    globalEmit () {
        // Emit event to local instance + all other player instances
    };
};

/**
 * Class listens for events and triggers functionality in other classes
 */
class EventHandler {

};

/**
 * Class handles the rendering of the board and background elements
 */
class BoardHandler {
    // Symbolic Constants
    #HEIGHT;
    #WIDTH;
    #RENDERER;
    #BOARD_POSITIONS = {};

    constructor (width, height, renderer) {
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
                'sun': {
                    position: [this.#WIDTH / 2 - 290, this.#HEIGHT / 2 + 10],
                    scale: 2.25,
                },
                'mercury': {
                    position: [this.#WIDTH / 2 - 200, this.#HEIGHT / 2 - 115]
                },
                'venus': {
                    position: [this.#WIDTH / 2 - 95, this.#HEIGHT / 2 - 155]
                },
                'earth': {
                    position: [this.#WIDTH / 2 + 35, this.#HEIGHT / 2 - 170]
                },
                'mars': {
                    position: [this.#WIDTH / 2 + 185, this.#HEIGHT / 2 - 140]
                },
                'jupiter': {
                    position: [this.#WIDTH / 2 + 305, this.#HEIGHT / 2 - 25],
                    scale: 1.3
                },
                'saturn': {
                    position: [this.#WIDTH / 2 + 200, this.#HEIGHT / 2 + 110]
                },
                'uranus': {
                    position: [this.#WIDTH / 2 + 15, this.#HEIGHT / 2 + 145]
                },
                'neptune': {
                    position: [this.#WIDTH / 2 - 155, this.#HEIGHT / 2 + 120]
                },
            },
            UIPositions: {
                centerScreen: [this.#WIDTH/2, this.#HEIGHT/2],
                fullscreenOption: [this.#WIDTH/1.15, this.#HEIGHT/1.2],
                playerOne: [this.#WIDTH/2 - 335, this.#HEIGHT/2 - 220],
                playerTwo: [this.#WIDTH/2 + 335, this.#HEIGHT/2 - 220],
                playerThree: [this.#WIDTH/2 - 335, this.#HEIGHT/2 + 220],
                playerFour: [this.#WIDTH/2 + 335, this.#HEIGHT/2 + 220],
            }
        };
    };

    #createSprite (x, y, spriteName, scaleValue) {
        return this.#RENDERER.add
            .sprite(x, y, spriteName)
            .setScale(scaleValue, scaleValue)
    };

    #createText (x, y, textContent) {
        return this.#RENDERER.add
            .text(x, y, textContent);
    }

    #renderBackground () {
        const centerScreen = this.#BOARD_POSITIONS.UIPositions.centerScreen;
        this.#createSprite(centerScreen[0], centerScreen[1], 'background', 1.3);
    };

    #renderBoardAsset () {
        const centerScreen = this.#BOARD_POSITIONS.UIPositions.centerScreen
        this.#createSprite(centerScreen[0], centerScreen[1], 'finalcompleteboard', 1.5);
    };

    #renderPlanetNodes () {
        const allPlanets = Object.keys(this.#BOARD_POSITIONS.planetPositions);

        allPlanets.forEach(planet => {
            const planetInfo = this.#BOARD_POSITIONS.planetPositions[planet];
            const planetScale = planetInfo.scale ?? 1.5;
            const currentPlanet = this.#createSprite(
                planetInfo.position[0], 
                planetInfo.position[1], 
                planet, 
                planetScale
            );
            this.#RENDERER.planets.children.entries.push(currentPlanet);
        });
    };

    #renderStarNodes () {
        this.#BOARD_POSITIONS.starPositions.forEach(position => {
            const currentStar = this.#createSprite(position[0], position[1], 'star', 1);
            this.#RENDERER.stars.children.entries.push(currentStar);
        });
    };

    #renderPlayerMarkers () {
        const spriteNames = [
            'playerone',
            'playertwo',
            'playerthree',
            'playerfour',
        ];

        spriteNames.forEach(sprite => {
            const sunPosition = this.#BOARD_POSITIONS.planetPositions.sun.position;
            const currentMarker = this.#createSprite(
                sunPosition[0],
                sunPosition[1],
                sprite,
                1
            );
            this.#RENDERER.markers.children.entries.push(currentMarker);
        });
    };

    #renderOptions () {
        const fullscreen = this.#createText(this.#WIDTH/1.15, this.#HEIGHT/1.2, 'Fullscreen')
        fullscreen.setInteractive();
    };

    #renderPlayerLeaderboard () {
        const spriteNames = [
            'playerone',
            'playertwo',
            'playerthree',
            'playerfour',
        ];
        const playerUIPositions = {
            playerone: this.#BOARD_POSITIONS.UIPositions.playerOne,
            playertwo: this.#BOARD_POSITIONS.UIPositions.playerTwo,
            playerthree: this.#BOARD_POSITIONS.UIPositions.playerThree,
            playerfour: this.#BOARD_POSITIONS.UIPositions.playerFour,
        }

        console.log(playerUIPositions);

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
                currentPlayer.replace('r', 'r '),
                {
                    fontSize: '18px',
                    fill: '#ffffff',
                }
            );
            this.#createText(
                sprite.x - sprite.width / 2 - 25,
                sprite.y - sprite.height / 2 + 70,
                'Score:',
                {
                    fontSize: '18px',
                    fill: '#ffffff',
                }
            );
        };
    };

    #renderBackgroundUI () {
        this.#renderOptions();
        this.#renderPlayerLeaderboard();
    };

    initializeBoard () {
        this.#renderBackground();
        this.#renderBoardAsset();
        this.#renderPlanetNodes();
        this.#renderStarNodes();
        this.#renderPlayerMarkers();
        this.#renderBackgroundUI();
    };
};

/**
 * Class handles the rendering and random calculation of dice rolls
 */
class DiceHandler {

};

/**
 * Class handles the rendering and updating of marker position on the board
 */
class MarkerHandler {

};

/**
 * Helper class handles the scene changing logic using Phaser's inbuilt solutions
 */
class SceneChanger {

};

/**
 * Class handles minigame trigger and random selection of minigame
 */
class MinigameHandler {

};

/**
 * Class handles blackhole trigger and random placement on new blackhole
 */
class BlackholeHandler {

};

/**
 * Class handles timing logic and rendering
 */
class TimerHandler {

};

/**
 * Class handles scoring logic and rendering
 */
class ScoreHandler {

};
