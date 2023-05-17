// Global scope variable to ensure there is only ever one instance of StateHandler class
let stateHandlerInstance = null;
// Global scope variable to ensure there is only ever one instance of EventDispatcher class
let eventDispatcherInstance = null;

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
    #SCENE_MANIPULATOR = this.sys;

    constructor() {
        super("MainboardScene");
        this.#WIDTH = this.sys.game.config.width;
        this.#HEIGHT = this.sys.game.config.height;
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
        // Board Init Functionality
    };
};

/**
 * Class handles the updating of game state as users take actions
 */
class BoardStateHandler extends StateHandler {
    #gamePath = [];
    #playerArray = [];

    constructor () {
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
class BoardEventDispatcher extends EventDispatcher {
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
