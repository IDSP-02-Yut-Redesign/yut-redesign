function playMiniGame(question, userAnswer) {
  // it's true or false mini game
  const correctAnswer = true; // or false, based on the question
  return userAnswer === correctAnswer;
}

function updatePoints(currentPoints, miniGameResult) {
  if (miniGameResult) {
    return currentPoints + 1;
  }
  return currentPoints;
}

module.exports = { playMiniGame, updatePoints };
