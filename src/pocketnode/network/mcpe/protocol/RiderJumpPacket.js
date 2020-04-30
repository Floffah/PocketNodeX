const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class RiderJumpPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.RIDER_JUMP_PACKET;
  }

  initVars() {
    /** @type {number} */
    this.jumpStrenght = -1; //percentage
  }

  _decodePayload() {
    this.jumpStrenght = this.readVarInt();
  }

  _encodePayload() {
    this.writeVarInt(this.jumpStrenght);
  }

  handle(session) {
    return session.handleRiderJump(this);
  }

}

module.exports = RiderJumpPacket;