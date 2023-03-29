const mockKeyupEventHandler = require("./mockKeyupEventHandler");

test("nothing happens if a key isn't pressed", () => {
  expect(mockKeyupEventHandler("")).toBe(false);
});

test("pressing the a key triggers angry emote", () => {
  expect(mockKeyupEventHandler("65")).toBe("angry");
});

test("pressing the c key triggers cry emote", () => {
  expect(mockKeyupEventHandler("67")).toBe("crying");
});

test("pressing the g key triggers thumbsUp emote", () => {
  expect(mockKeyupEventHandler("71")).toBe("thumbsUp");
});

test("pressing the h key triggers heart emote", () => {
  expect(mockKeyupEventHandler("72")).toBe("heart");
});

test("pressing the l key triggers laugh emote", () => {
  expect(mockKeyupEventHandler("76")).toBe("laugh");
});

test("pressing the s key triggers smile emote", () => {
  expect(mockKeyupEventHandler("83")).toBe("smile");
});

test("pressing an unbound key followed by a bound key triggers emote", () => {
  expect(mockKeyupEventHandler("82")).toBe(false);
  expect(mockKeyupEventHandler("83")).toBe("smile");
});

test("pressing an unbound key returns false", () => {
  expect(mockKeyupEventHandler("90")).toBe(false);
});
