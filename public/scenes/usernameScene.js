class UsernameScene extends Phaser.Scene {
  constructor() {
    super("UsernameScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("lightspeedLogo", "assets/lightspeedLogo.png");
    this.load.image("questionBox", "assets/questionBox.png");

    this.sys.events.on("start", () => {
      this.scene.setVisible(true);
      this.scene.setActive(true);
    });
  }

  create() {
    // TEMPORARY USERNAME SELECTION (comment out/remove later)
    this.createUser = function () {
      const userInput = prompt(
        "Welcome to LightSpeed! Please enter a username."
      );
      try {
        this.getAllUsernames().then((usernames) => {
          console.log(usernames);
          usernames.forEach((username) => {
            if (userInput === username) {
              this.createUser();
            }
          });
        });
      } catch (error) {
        console.warn(error);
      }
      document.cookie = `username=${userInput}`;
    };

    this.getAllUsernames = async function () {
      const response = await fetch("/scores/allUsernames");
      if (response.ok) {
        const usernames = await response.json();
        return usernames;
      }
    };

    // Set background size
    const bgWidth = this.sys.game.config.width;
    const bgHeight = this.sys.game.config.height;

    // Create two background sprites, offset by half the width of the image
    this.bg1 = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, "background")
      .setScale(1, 1)
      .setPosition(bgWidth / 2, bgHeight / 2);

    this.bg2 = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, "background")
      .setScale(1, 1)
      .setPosition(bgWidth / 2 - 15, bgHeight / 2 + 5);

    const lightspeedLogo = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 4 + 40,
        "lightspeedLogo"
      )
      .setScale(1.5, 1.5);

    const inputBox = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 - 10,
        "questionBox"
      )
      .setScale(1.1, 2)
      .setInteractive();

    // Create an input HTML element outside of the canvas
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.style.position = "fixed";
    inputElement.style.opacity = "0";
    document.body.appendChild(inputElement);

    // Create Phaser Text object to display typed text
    this.typedText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 - 10,
        "",
        { fontSize: "18px", fill: "#ffffff" }
      )
      .setScale(2, 2)
      .setOrigin(0.5, 0.5);

    // Create Phaser Text object to display placeholder
    this.placeholderText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 - 10,
        "Enter Username",
        { fontSize: "18px", fill: "#ffffff" }
      )
      .setScale(1.5, 1.5)
      .setOrigin(0.5, 0.5);

    inputBox.on("pointerup", () => {
      inputElement.focus();
    });

    inputElement.addEventListener("input", () => {
      this.typedText.setText(inputElement.value);
      // If user starts typing, hide placeholder
      if (inputElement.value.length > 0) {
        this.placeholderText.visible = false;
      } else {
        this.placeholderText.visible = true;
      }
    });

    const startButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 + 70,
        "questionBox"
      )
      .setScale(1.1, 2)
      .setInteractive();

    this.add
      .text(
        this.sys.game.config.width / 2 - 65,
        this.sys.game.config.height / 1.5 + 52,
        "START",
        {
          fontSize: "18px",
          fill: "#ffffff",
        }
      )
      .setScale(2, 2);

    startButton.once("pointerup", () => {
      sessionStorage.setItem("username", inputElement.value);
      this.scene.pause();
      this.scene.setVisible(false);
      this.scene.setActive(false);
      this.scene.start("GameboardScene");
    });
  }

  update() {
    // Update the position of both background sprites
    this.bg1.tilePositionX -= 1;
    this.bg2.tilePositionX -= 1;
  }
}
