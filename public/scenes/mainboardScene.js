class MainboardScene extends Phaser.Scene {
    #WIDTH;
    #HEIGHT;
    #outputNumber;
    #gamePath = [];

    constructor() {
        super("MainboardScene");
    }

    preload() {
        this.#WIDTH = this.sys.game.config.width;
        this.#HEIGHT = this.sys.game.config.height;
        this.#gamePath = [
            {
                name: "sun",
                x: this.#WIDTH / 2 - 290,
                y: this.#HEIGHT / 2 + 10,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star1",
                x: this.#WIDTH / 2 - 255,
                y: this.#HEIGHT / 2 - 75,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star2",
                x: this.#WIDTH / 2 - 235,
                y: this.#HEIGHT / 2 - 95,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "mercury",
                x: this.#WIDTH / 2 - 200,
                y: this.#HEIGHT / 2 - 115,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star3",
                x: this.#WIDTH / 2 - 165,
                y: this.#HEIGHT / 2 - 133,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star4",
                x: this.#WIDTH / 2 - 140,
                y: this.#HEIGHT / 2 - 142,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "venus",
                x: this.#WIDTH / 2 - 95,
                y: this.#HEIGHT / 2 - 155,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star5",
                x: this.#WIDTH / 2 - 50,
                y: this.#HEIGHT / 2 - 160,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star6",
                x: this.#WIDTH / 2 - 22,
                y: this.#HEIGHT / 2 - 163,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "earth",
                x: this.#WIDTH / 2 + 35,
                y: this.#HEIGHT / 2 - 170,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star7",
                x: this.#WIDTH / 2 + 95,
                y: this.#HEIGHT / 2 - 157,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star8",
                x: this.#WIDTH / 2 + 125,
                y: this.#HEIGHT / 2 - 151,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "mars",
                x: this.#WIDTH / 2 + 185,
                y: this.#HEIGHT / 2 - 140,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star9",
                x: this.#WIDTH / 2 + 240,
                y: this.#HEIGHT / 2 - 108,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star10",
                x: this.#WIDTH / 2 + 265,
                y: this.#HEIGHT / 2 - 90,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "jupiter",
                x: this.#WIDTH / 2 + 305,
                y: this.#HEIGHT / 2 - 25,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star11",
                x: this.#WIDTH / 2 + 280,
                y: this.#HEIGHT / 2 + 60,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star12",
                x: this.#WIDTH / 2 + 255,
                y: this.#HEIGHT / 2 + 80,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "saturn",
                x: this.#WIDTH / 2 + 200,
                y: this.#HEIGHT / 2 + 110,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star13",
                x: this.#WIDTH / 2 + 132,
                y: this.#HEIGHT / 2 + 135,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star14",
                x: this.#WIDTH / 2 + 95,
                y: this.#HEIGHT / 2 + 142,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "uranus",
                x: this.#WIDTH / 2 + 15,
                y: this.#HEIGHT / 2 + 145,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star15",
                x: this.#WIDTH / 2 - 60,
                y: this.#HEIGHT / 2 + 142,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star16",
                x: this.#WIDTH / 2 - 90,
                y: this.#HEIGHT / 2 + 137,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "neptune",
                x: this.#WIDTH / 2 - 155,
                y: this.#HEIGHT / 2 + 120,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star17",
                x: this.#WIDTH / 2 - 215,
                y: this.#HEIGHT / 2 + 90,
                isEvent: false,
                isBlackHole: false,
            },
            {
                name: "star18",
                x: this.#WIDTH / 2 - 240,
                y: this.#HEIGHT / 2 + 73,
                isEvent: false,
                isBlackHole: false,
            },
        ];
        // load images
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
    }

    create() {
        // create bg sprite
        this.add
            .sprite(0, 0, "background")
            .setScale(1, 1)
            .setPosition(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2
            );
        let timer = this.add.text(700, 0, `Timer:`);
        timer.depth = 1;

        // create inner board
        this.add
            .sprite(0, 0, "finalcompleteboard")
            .setScale(1.5, 1.5)
            .setPosition(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2
            );

        const fullscreenText = this.add.text(
            this.sys.game.config.width / 1.15,
            this.sys.game.config.height / 1.2,
            "Fullscreen"
        )
            .setInteractive();
        fullscreenText.addListener("pointerup", () => {
            this.sys.game.scale.toggleFullscreen();
        });
        // Create sun
        let sun = this.add
            .sprite(0, 0, "sun")
            .setScale(2.25, 2.25)
            .setPosition(this.#gamePath[0].x, this.#gamePath[0].y);

        // create star1
        let star1 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[1].x, this.#gamePath[1].y);

        // create star2
        let star2 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[2].x, this.#gamePath[2].y);

        // create mercury
        this.add
            .sprite(0, 0, "mercury")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[3].x, this.#gamePath[3].y);

        // create star3
        let star3 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[4].x, this.#gamePath[4].y);

        // create star4
        let star4 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[5].x, this.#gamePath[5].y);

        // create venus
        this.add
            .sprite(0, 0, "venus")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[6].x, this.#gamePath[6].y);

        // create star5
        let star5 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[7].x, this.#gamePath[7].y);

        // create star6
        let star6 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[8].x, this.#gamePath[8].y);

        // Create earth
        let earth = this.add
            .sprite(0, 0, "earth")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[9].x, this.#gamePath[9].y);

        // create star7
        let star7 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[10].x, this.#gamePath[10].y);

        // create star8
        let star8 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[11].x, this.#gamePath[11].y);

        // create mars
        this.add
            .sprite(0, 0, "mars")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[12].x, this.#gamePath[12].y);

        // create star9
        let star9 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[13].x, this.#gamePath[13].y);

        // create star10
        let star10 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[14].x, this.#gamePath[14].y);

        // Create jupiter and make it interactive
        let jupiter = this.add
            .sprite(0, 0, "jupiter")
            .setScale(1.3, 1.3)
            .setPosition(this.#gamePath[15].x, this.#gamePath[15].y);

        // create star11
        let star11 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[16].x, this.#gamePath[16].y);

        // create star12
        let star12 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[17].x, this.#gamePath[17].y);

        // create saturn
        this.add
            .sprite(0, 0, "saturn")
            .setScale(1.5, 1.5)
            .setAngle(35)
            .setPosition(this.#gamePath[18].x, this.#gamePath[18].y);

        let star13 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[19].x, this.#gamePath[19].y);

        // create star14
        let star14 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[20].x, this.#gamePath[20].y);

        // Create uranus and make it interactive
        let uranus = this.add
            .sprite(0, 0, "uranus")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[21].x, this.#gamePath[21].y)
            .setInteractive();

        // create star15
        let star15 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[22].x, this.#gamePath[22].y);

        // create star16
        let star16 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[23].x, this.#gamePath[23].y);

        // create neptune
        this.add
            .sprite(0, 0, "neptune")
            .setScale(1.5, 1.5)
            .setPosition(this.#gamePath[24].x, this.#gamePath[24].y);

        // create star17
        let star17 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[25].x, this.#gamePath[25].y);

        // create star18
        let star18 = this.add
            .sprite(0, 0, "star")
            .setScale(1, 1)
            .setPosition(this.#gamePath[26].x, this.#gamePath[26].y);

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

        const worldWidth = this.sys.game.config.width;
        const worldHeight = this.sys.game.config.height;

        // Position all players in each corner of the game world
        const playerOne = this.add
            .sprite(0, 0, "playerone")
            .setPosition(
                this.sys.game.config.width / 2 - 335,
                this.sys.game.config.height / 2 - 220
            )
            .setScale(2, 2);

        // Add text box for the playerOne
        let playerOneText = this.add.text(
            playerOne.x - playerOne.width / 2 - 25,
            playerOne.y - playerOne.height / 2 + 50,
            "Player 1",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        // Add text box for the playerOne
        let playerOneScore = this.add.text(
            playerOne.x - playerOne.width / 2 - 25,
            playerOne.y - playerOne.height / 2 + 70,
            "Score:",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        const playerTwo = this.add
            .sprite(worldWidth, 0, "playertwo")
            .setPosition(
                this.sys.game.config.width / 2 + 335,
                this.sys.game.config.height / 2 - 220
            )
            .setScale(2, 2);

        // Add text box for the playerTwo
        let playerTwoText = this.add.text(
            playerTwo.x - playerTwo.width / 2 - 25,
            playerTwo.y - playerTwo.height / 2 + 50,
            "Player 2",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        // Add text box for the playerTwo
        let playerTwoScore = this.add.text(
            playerTwo.x - playerTwo.width / 2 - 25,
            playerTwo.y - playerTwo.height / 2 + 70,
            "Score:",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        const playerThree = this.add
            .sprite(0, worldHeight, "playerthree")
            .setPosition(
                this.sys.game.config.width / 2 - 335,
                this.sys.game.config.height / 2 + 220
            )
            .setScale(2, 2);

        // Add text box for the playerThree
        let playerThreeText = this.add.text(
            playerThree.x - playerThree.width / 2 - 25,
            playerThree.y - playerThree.height / 2 + 50,
            "Player 3",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        // Add text box for the playerThree
        let playerThreeScore = this.add.text(
            playerThree.x - playerThree.width / 2 - 25,
            playerThree.y - playerThree.height / 2 + 70,
            "Score:",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        const playerFour = this.add
            .sprite(worldWidth, worldHeight, "playerfour")
            .setPosition(
                this.sys.game.config.width / 2 + 335,
                this.sys.game.config.height / 2 + 220
            )
            .setScale(2, 2);

        // Add text box for the playerFour
        let playerFourText = this.add.text(
            playerFour.x - playerFour.width / 2 - 25,
            playerFour.y - playerFour.height / 2 + 50,
            "Player 4",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        // Add text box for the playerFour
        let playerFourScore = this.add.text(
            playerFour.x - playerFour.width / 2 - 25,
            playerFour.y - playerFour.height / 2 + 70,
            "Score:",
            {
                fontSize: "18px",
                fill: "#ffffff",
            }
        );

        this.playerOneMarker = this.add
            .sprite(0, 0, "playerone")
            .setPosition(this.#gamePath[0].x, this.#gamePath[0].y);

        this.playerTwoMarker = this.add
            .sprite(0, 0, "playertwo")
            .setPosition(this.#gamePath[0].x, this.#gamePath[0].y);

        this.playerThreeMarker = this.add
            .sprite(0, 0, "playerthree")
            .setPosition(this.#gamePath[0].x, this.#gamePath[0].y);

        this.playerFourMarker = this.add
            .sprite(0, 0, "playerfour")
            .setPosition(this.#gamePath[0].x, this.#gamePath[0].y);
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
            let curruntOutputNumber = this.getDiceNumberFromFace(this.dice.texture.key);
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
                        window.location.href = "http://hypfgqkmxo.us16.qoddiapp.com/";
                    }
                    if (nextPositionIndex === 6) {
                        console.log("Player has reached the venus");
                        window.location.href = "https://qubeqode.github.io/phaserMemoryGame/";
                    }
                    if (nextPositionIndex === 9) {
                        console.log("Player has reached the earth");
                        window.location.href =
                            "https://jamieskidmore.github.io/meteorShowerMinigame/";
                    }
                },
            });
        } else {
            console.log("Current position not found in game path");
        }
    }
}