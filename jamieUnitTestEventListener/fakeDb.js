Emote = require("./emoteClass");

// These emotes and key bindings are strictly examples
const angry = new Emote("angry", "a", "65", "");
const cry = new Emote("crying", "c", "67", "");
const heart = new Emote("heart", "h", "72", "");
const laugh = new Emote("laugh", "l", "76", "");
const smile = new Emote("smile", "s", "83", "");
const thumbsUp = new Emote("thumbsUp", "g", "71", "");

const fakeDb = {
  angry,
  cry,
  heart,
  laugh,
  smile,
  thumbsUp,
};

function getEmotes() {
  return Object.values(fakeDb);
}

module.exports = getEmotes;
