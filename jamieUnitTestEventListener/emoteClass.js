class Emote {
  constructor(emoteType, key, code, asset) {
    this.emoteType = emoteType
    this.key = key
    this.code = code
    this.asset = asset //link to svg file
  }
}

module.exports = Emote