class TriviaScene extends Phaser.Scene {
  #gameStarted;
  #gameOver;
  #scoreText;
  #score;
  #timer;
  #timerEvent;
  #gameTimeLimit;
  #questions;
  #resultText;
  #resultTween;
  #questionLayout;
  #question;
  #allAnswers;
  #scoreSaved;
  #fastFinishText;
  #questionIndexLimit = 59;
  #calledFrom;

  constructor() {
    super("TriviaScene");
  }

  init(data) {
    const { source } = data;
    this.#calledFrom = source;
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("questionLayout", "assets/questionLayout.png");
    this.load.image("titlescreen", "assets/titlescreen.png");
    // this.load.image("", "assets/.png");
  }

  create() {
    this.#gameStarted = false;
    this.#gameOver = false;
    this.#scoreText;
    this.#score = 0;
    if (this.#timer) {
      this.#timer.destroy();
      this.#timer = null;
    }
    if (this.#timerEvent) {
      this.#timerEvent.destroy();
      this.#timerEvent = null;
    }
    this.#gameTimeLimit = 30;
    this.#questions = [];
    if (this.#resultText) {
      this.#resultText.destroy();
      this.#resultText = null;
    }
    if (this.#resultTween) {
      this.#resultTween.destroy();
      this.#resultTween = null;
    }
    this.#questionLayout;
    this.#question;
    this.#allAnswers;
    this.#fastFinishText;
    this.#scoreSaved = false;

    this.add
      .sprite(0, 0, "background")
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    this.#scoreText = this.add.text(0, 0, `Score: ${this.#score}`);
    this.#timer = this.add.text(
      this.sys.game.config.width - 90,
      0,
      `Timer: ${this.#gameTimeLimit}`
    );
    this.#timer.depth = 1;

    // const startButton = this.add
    //   .sprite(
    //     this.sys.game.config.width / 2,
    //     this.sys.game.config.height / 2,
    //     "startButton"
    //   )
    //   .setInteractive();

    // startButton.once("pointerdown", async () => {
    if (!this.#timerEvent) {
      this.#timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
      });
    }
    // startButton.setVisible(false);

    this.startGame();
    // });
  }

  updateScore() {
    this.#scoreText.text = `Score: ${this.#score}`;
  }

  async getQuestions() {
    try {
      const response = await fetch("/trivia/getQuestions");

      if (response.ok) {
        const body = await response.json();

        if (body) {
          this.#questions = body;
        }
      } else {
        console.warn("Failed to get questions");
      }
    } catch (error) {
      console.warn(error);
    }
  }

  nextQuestion(question, allAnswers, index) {
    if (this.#questions.length > 0) {
      question.text = this.#questions[index].question;
      for (let i = 0; i < this.#allAnswers.length; i++) {
        const answer = this.#allAnswers[i];
        answer.text = this.#questions[index].answers[i];
      }
    } else {
      console.warn("No questions in array");
    }
  }

  drawResult(isCorrect) {
    if (!this.#resultText) {
      this.#resultText = this.add.text(
        this.sys.game.config.width / 1.5,
        this.sys.game.config.height / 2,
        "Hey",
        {
          fontFamily: "Bruno Ace SC",
          fill: "#ffffff",
          fontSize: "25px",
          stroke: "#000000",
          strokeThickness: 5,
        }
      );
      this.#resultText.setAlpha(0);
    }

    if (isCorrect) {
      this.#resultText.setFill("#7ff525");
      this.#resultText.text = "Correct";
    } else {
      this.#resultText.setFill("#bf0d34");
      this.#resultText.text = "Incorrect";
    }

    if (this.#resultTween) {
      if (this.#resultTween.isPlaying) {
        this.#resultTween.stop();
      }
      this.#resultTween.destroy();
    }

    this.#resultTween = this.add.tween({
      targets: this.#resultText,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
    });
  }

  async submitAnswer(question, answer) {
    try {
      const response = await fetch("/trivia/submitAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });

      if (response.ok) {
        const isCorrect = await response.json();
        if (isCorrect) {
          this.#score++;
          this.updateScore();
        }
        this.drawResult(isCorrect);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  updateTimer() {
    if (this.#gameTimeLimit > 0) {
      this.#gameTimeLimit -= 1;
      this.#timer.setText(`Timer: ${this.#gameTimeLimit}`);
    } else {
      this.endGame();
    }
  }

  endGame() {
    if (!this.#gameOver) {
      if (this.#fastFinishText) {
        this.#fastFinishText.destroy();
        this.#fastFinishText = null;
      }
      this.#gameOver = true;
      this.#gameStarted = false;
      this.#timerEvent.destroy();
      this.add.text(
        this.sys.game.config.width / 4 + 80,
        this.sys.game.config.height / 2 - 100,
        "Game Over!",
        {
          fontFamily: "Bruno Ace SC",
          fill: "#ffffff",
          fontSize: "75px",
          stroke: "#000000",
          strokeThickness: 5,
          align: "center",
        }
      );
      if (this.#questionLayout) {
        this.#questionLayout.destroy();
      }
      if (this.#allAnswers) {
        for (const answer of this.#allAnswers) {
          answer.destroy();
        }
      }
      this.#allAnswers = null;
      if (this.#question) {
        this.#question.destroy();
      }

      if (this.#calledFrom === "GameboardScene") {
        this.saveScore();
      }

      const calledFrom = this.#calledFrom;
      setTimeout(() => {
        this.scene.resume(calledFrom);
        this.scene.stop();
      }, 5000);
    }
  }

  async endGameQuick() {
    this.#questionLayout.destroy();
    this.#question.destroy();
    for (const answer of this.#allAnswers) {
      answer.destroy();
    }
    this.#fastFinishText = this.add.text(
      this.sys.game.config.width / 8 + 100,
      this.sys.game.config.height / 2 - 100,
      "did u even read the questions bro",
      {
        fontFamily: "Bruno Ace SC",
        fill: "#ffffff",
        fontSize: "35px",
        stroke: "#000000",
        strokeThickness: 5,
        align: "center",
      }
    );
  }

  async startGame() {
    if (this.#gameOver) {
      console.warn("Game is already over or there are no questions");
      return;
    }

    this.#gameStarted = true;
    this.#gameOver = false;
    await this.getQuestions();

    const questionStyle = {
      fontFamily: "Bruno Ace SC",
      fill: "#ffffff",
      fontSize: "25px",
      wordWrap: { width: 650 },
      fixedWidth: 650,
      align: "top_center",
    };
    const answerStyle = {
      fontFamily: "Bruno Ace SC",
      fill: "#ffffff",
      fontSize: "25px",
      wordWrap: { width: 550 },
      fixedWidth: 550,
      align: "center",
    };

    this.#questionLayout = this.add.image(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "questionLayout"
    );
    this.#questionLayout.setScale(2, 2);
    this.#question = this.add.text(
      this.sys.game.config.width / 8 + 170,
      this.sys.game.config.height / 8 + 50,
      "This is the question asasd asd d d as sa",
      questionStyle
    );
    const answerOne = this.add
      .text(
        this.sys.game.config.width / 6.5 + 170,
        this.sys.game.config.height / 2.6 + 15,
        "This is an answer askjdabjk",
        answerStyle
      )
      .setInteractive();
    const answerTwo = this.add
      .text(
        this.sys.game.config.width / 6.5 + 170,
        this.sys.game.config.height / 1.85 - 5,
        "This is an answer askjdabjk",
        answerStyle
      )
      .setInteractive();
    const answerThree = this.add
      .text(
        this.sys.game.config.width / 6.5 + 170,
        this.sys.game.config.height / 1.44 - 23,
        "This is an answer askjdabjk",
        answerStyle
      )
      .setInteractive();
    const answerFour = this.add
      .text(
        this.sys.game.config.width / 6.5 + 170,
        this.sys.game.config.height / 1.18 - 43,
        "This is an answer askjdabjk",
        answerStyle
      )
      .setInteractive();
    this.#allAnswers = [answerOne, answerTwo, answerThree, answerFour];
    let questionIndex = 0;

    this.nextQuestion(this.#question, this.#allAnswers, 0);

    answerOne.addListener("pointerdown", async () => {
      this.submitAnswer(this.#question.text, answerOne.text);
      if (questionIndex < this.#questionIndexLimit) {
        questionIndex++;
        this.nextQuestion(this.#question, this.#allAnswers, questionIndex);
      } else {
        this.endGameQuick();
      }
    });
    answerTwo.addListener("pointerdown", async () => {
      this.submitAnswer(this.#question.text, answerTwo.text);
      if (questionIndex < this.#questionIndexLimit) {
        questionIndex++;
        this.nextQuestion(this.#question, this.#allAnswers, questionIndex);
      } else {
        this.endGameQuick();
      }
    });
    answerThree.addListener("pointerdown", async () => {
      this.submitAnswer(this.#question.text, answerThree.text);
      if (questionIndex < this.#questionIndexLimit) {
        questionIndex++;
        this.nextQuestion(this.#question, this.#allAnswers, questionIndex);
      } else {
        this.endGameQuick();
      }
    });
    answerFour.addListener("pointerdown", async () => {
      this.submitAnswer(this.#question.text, answerFour.text);
      if (questionIndex < this.#questionIndexLimit) {
        questionIndex++;
        this.nextQuestion(this.#question, this.#allAnswers, questionIndex);
      } else {
        this.endGameQuick();
      }
    });
  }

  async saveScore() {
    if (!this.#scoreSaved) {
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
