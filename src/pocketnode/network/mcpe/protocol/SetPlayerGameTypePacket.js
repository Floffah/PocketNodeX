const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class SetPlayerGameTypePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.SET_PLAYER_GAME_TYPE_PACKET;
  }

  initVars() {
    this.gamemode = -1;
  }

  _decodePayload() {
    console.log("player gamemode packet called");
    this.gamemode = this.readVarInt();
  }

  _encodePayload() {
    this.writeVarInt(this.gamemode);
  }

  handle(session) {
    return session.handleSetPlayerGameType(this);
  }

}

module.exports = SetPlayerGameTypePacket;