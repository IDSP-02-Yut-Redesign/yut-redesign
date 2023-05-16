// Global scope variable to ensure there is only ever one instance of StateHandler class
let stateHandlerInstance = null;
// Global scope variable to ensure there is only ever one instance of EventDispatcher class
let eventDispatcherInstance = null;

class GameboardScene extends Phaser.Scene {
    // Dice Handler Class
    #diceHandler;

    // Movement Handler Class
    #movementHandler;

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

class BoardStateHandler extends StateHandler {
    #gamePath = [];
    #playerArray = [];

    constructor () {
        // Recieves sprite class instance for everything made in create() except boardBackground
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

class BoardEventDispatcher extends EventDispatcher {
    socketEmit () {
        // Emit custom event using socket
    };

    globalEmit () {
        // Emit event to local instance + all other player instances
    };
}
