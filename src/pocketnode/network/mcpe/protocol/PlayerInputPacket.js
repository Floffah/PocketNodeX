const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class PlayerInputPacket extends DataPacket {
  static getId() {
    return ProtocolInfo.PLAYER_INPUT_PACKET;
  }

  initVars() {
    this.motionX = -1;
    this.motionY = -1;
    this.jumping = false;
    this.sneaking = false;
  }

  _decodePayload() {
    this.motionX = this.readLFloat();
    this.motionY = this.readLFloat();
    this.jumping = this.readBool();
    this.sneaking = this.readBool();
  }

  _encodePayload() {
    this.writeLFloat(this.motionX);
    this.writeLFloat(this.motionY);
    this.writeBool(this.jumping);
    this.writeBool(this.sneaking);
  }

  handle(session) {
    return session.handlePlayerInput(this);
  }

}

module.exports = PlayerInputPacket;