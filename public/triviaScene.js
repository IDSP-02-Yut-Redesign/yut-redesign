let gameStarted = false;
let gameOver = false;
let scoreText;
let score = 0;
let timer;
let timerEvent;
let gameTimeLimit = 30;
let questions = [];
let resultText;
let resultTween;
let questionLayout;
let question;
let allAnswers;

const updateScore = () => {
  scoreText.text = `Score: ${score}`;
};

const getQuestions = async () => {
  try {
    const response = await fetch("/getQuestions");

    if (response.ok) {
      const body = await response.json();

      if (body) {
        questions = body;
      }
    } else {
      console.warn("Failed to get questions");
    }
  } catch (error) {
    console.warn(error);
  }
};

const nextQuestion = (question, allAnswers, index) => {
  if (questions.length > 0) {
    question.text = questions[index].question;
    for (let i = 0; i < allAnswers.length; i++) {
      const answer = allAnswers[i];
      answer.text = questions[index].answers[i];
    }
  } else {
    console.warn("No questions in array");
  }
};

class TriviaScene extends Phaser.Scene {
  constructor() {
    super("TriviaScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("startButton", "assets/startButton.png");
    this.load.image("questionLayout", "assets/questionLayout.png");
    this.load.image("titlescreen", "assets/titlescreen.png");
    // this.load.image("", "assets/.png");
  }

  create() {
    const drawResult = (isCorrect) => {
      if (!resultText) {
        resultText = this.add.text(
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
        resultText.setAlpha(0);
      }

      if (isCorrect) {
        resultText.setFill("#7ff525");
        resultText.text = "Correct";
      } else {
        resultText.setFill("#bf0d34");
        resultText.text = "Incorrect";
      }

      if (resultTween) {
        if (resultTween.isPlaying) {
          resultTween.stop();
        }
        resultTween.destroy();
      }

      resultTween = this.add.tween({
        targets: resultText,
        ease: "Sine.easeInOut",
        duration: 2000,
        delay: 0,
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
      });
    };

    const submitAnswer = async (question, answer) => {
      try {
        const response = await fetch("/submitAnswer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, answer }),
        });

        if (response.ok) {
          const isCorrect = await response.json();
          if (isCorrect) {
            score++;
            updateScore();
          }
          drawResult(isCorrect);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    const endGame = () => {
      if (!gameOver) {
        gameOver = true;
        gameStarted = false;
        timerEvent.destroy();
        this.add.text(
          this.sys.game.config.width / 4,
          this.sys.game.config.height / 2,
          "Finished!",
          {
            fontFamily: "Bruno Ace SC",
            fill: "#ffffff",
            fontSize: "75px",
            stroke: "#000000",
            strokeThickness: 5,
            align: "center",
          }
        );
        questionLayout.destroy();
        for (const answer of allAnswers) {
          answer.destroy();
        }
        question.destroy();
      }
    };

    const updateTimer = () => {
      if (gameTimeLimit > 0) {
        gameTimeLimit -= 1;
        timer.setText(`Timer: ${gameTimeLimit}`);
      } else {
        endGame();
      }
    };

    const startGame = async () => {
      if (gameOver) {
        console.warn("Game is already over or there are no questions");
        return;
      }

      gameStarted = true;
      gameOver = false;
      await getQuestions();

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

      questionLayout = this.add.image(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "questionLayout"
      );
      questionLayout.setScale(2, 2);
      question = this.add.text(
        this.sys.game.config.width / 8,
        this.sys.game.config.height / 8,
        "This is the question asasd asd d d as sa",
        questionStyle
      );
      const answerOne = this.add
        .text(
          this.sys.game.config.width / 6.5,
          this.sys.game.config.height / 2.6,
          "This is an answer askjdabjk",
          answerStyle
        )
        .setInteractive();
      const answerTwo = this.add
        .text(
          this.sys.game.config.width / 6.5,
          this.sys.game.config.height / 1.85,
          "This is an answer askjdabjk",
          answerStyle
        )
        .setInteractive();
      const answerThree = this.add
        .text(
          this.sys.game.config.width / 6.5,
          this.sys.game.config.height / 1.44,
          "This is an answer askjdabjk",
          answerStyle
        )
        .setInteractive();
      const answerFour = this.add
        .text(
          this.sys.game.config.width / 6.5,
          this.sys.game.config.height / 1.18,
          "This is an answer askjdabjk",
          answerStyle
        )
        .setInteractive();
      allAnswers = [answerOne, answerTwo, answerThree, answerFour];
      let questionIndex = 0;

      nextQuestion(question, allAnswers, 0);

      answerOne.addListener("pointerdown", async () => {
        submitAnswer(question.text, answerOne.text);
        if (questionIndex < 4) {
          questionIndex++;
          nextQuestion(question, allAnswers, questionIndex);
        } else {
          endGame();
        }
      });
      answerTwo.addListener("pointerdown", async () => {
        submitAnswer(question.text, answerTwo.text);
        if (questionIndex < 4) {
          questionIndex++;
          nextQuestion(question, allAnswers, questionIndex);
        } else {
          endGame();
        }
      });
      answerThree.addListener("pointerdown", async () => {
        submitAnswer(question.text, answerThree.text);
        if (questionIndex < 4) {
          questionIndex++;
          nextQuestion(question, allAnswers, questionIndex);
        } else {
          endGame();
        }
      });
      answerFour.addListener("pointerdown", async () => {
        submitAnswer(question.text, answerFour.text);
        if (questionIndex < 4) {
          questionIndex++;
          nextQuestion(question, allAnswers, questionIndex);
        } else {
          endGame();
        }
      });
    };

    this.add
      .sprite(0, 0, "background")
      .setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    scoreText = this.add.text(0, 0, `Score: ${score}`);
    timer = this.add.text(700, 0, `Timer: ${gameTimeLimit}`);
    timer.depth = 1;

    const startButton = this.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "startButton"
      )
      .setInteractive();

    startButton.once("pointerdown", async () => {
      if (!timerEvent) {
        timerEvent = this.time.addEvent({
          delay: 1000,
          callback: updateTimer,
          callbackScope: this,
          loop: true,
        });
      }
      startButton.setVisible(false);

      startGame();
    });
  }
}
