getEmotes = require("./fakeDb");

const emoteList = getEmotes();


// Mocks an emote being sent to the DOM when user presses a key that is bound to an emote in the database.
function mockKeyupEventHandler(code) {
  for (emote of emoteList) {
    if (emote.code == code) {
      return emote.emoteType;
    }
  }
  return false;
}

/* 
Actual implementation of the event handler that sends an emote to the DOM could look like this:

document.addEventListener("keyup", (e) => {
  for (emote of emoteList) {
    if (emote.code == e.code) {
      const svgEmoteIcon = document.createElementNS(emote.asset, "svg")
      const emoteSection = document.querySelector(".emoteSection")
      emoteSection.append(svgEmoteIcon)
    }
  }
})
*/

module.exports = mockKeyupEventHandler;
