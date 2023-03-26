const { playMiniGame, updatePoints } = require("./minigame");

describe("playMiniGame", () => {
  test("should return true or false as a result", () => {
    const question = "Example question";
    const userAnswer = true; // or false, depending on the user's choice
    const result = playMiniGame(question, userAnswer);
    expect(typeof result).toBe("boolean");
  });

  // i will add more tests if more mini game added
});

describe("updatePoints", () => {
  test("should add 1 point if the player wins the mini game", () => {
    const currentPoints = 5;
    const miniGameResult = true;
    const updatedPoints = updatePoints(currentPoints, miniGameResult);
    expect(updatedPoints).toBe(6);
  });

  test("should not add points if the player loses the mini game", () => {
    const currentPoints = 5;
    const miniGameResult = false;
    const updatedPoints = updatePoints(currentPoints, miniGameResult);
    expect(updatedPoints).toBe(5);
  });
});
