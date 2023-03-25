//! The following section is filled with mock functionality produced to confirm the test logic.

const rollDice = () => {
    const outcomes = [ 1, 2, 3, 4, 5, 6 ];

    let rolledOutcome = outcomes[Math.round(Math.random()*5)];


    if (rolledOutcome === 6) {
        rolledOutcome += outcomes[Math.round(Math.random()*5)];
    }

    return rolledOutcome;
};

const calculateDiceValues = (totalRoll) => {
    const diceRolls = [];

    if (totalRoll > 6) {
        diceRolls.push(6);
        diceRolls.push(totalRoll - 6);
    } else {
        diceRolls.push(totalRoll);
    }
    
    return diceRolls;
}

module.exports = { rollDice, calculateDiceValues };
