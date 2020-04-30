const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class SetDefaultGameTypePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.SET_DEFAULT_GAME_TYPE_PACKET;
  }

  initVars() {
    this.gamemode = -1;
  }

  _decodePayload() {
    this.gamemode = this.readVarInt();
  }

  _encodePayload() {
    this.writeUnsignedVarInt(this.gamemode);
  }

  handle(session) {
    return session.handleSetDefaultGameType(this);
  }

}

module.exports = SetDefaultGameTypePacket;