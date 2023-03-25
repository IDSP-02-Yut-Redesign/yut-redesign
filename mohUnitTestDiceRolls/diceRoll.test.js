const { rollDice, calculateDiceValues } = require('./diceRoll');

describe('rollDice', () => {
    test('should return a number between 1 and 12', () => {
      const result = rollDice();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(12);
    });
});

describe('calculateDiceValues', () => {
    test('should return dice roll when total roll <= 6', () => {
        const result = calculateDiceValues(4);
        expect(result[0]).toBe(4);
    });
    test('should return an array of 2 values when total roll > 6', () => {
        const result = calculateDiceValues(9);
        expect(result.length).toBe(2);
    });
    test('should return an array where first value is 6 when total roll > 6', () => {
        const result = calculateDiceValues(9);
        expect(result[0]).toBe(6);
    })
    test('should return a total value = total roll when total roll > 6', () => {
        const result = calculateDiceValues(9);
        expect(result[0] + result[1]).toBe(9);
    })
});