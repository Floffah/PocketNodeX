const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class BlockPickRequestPacket extends DataPacket {
  static getId() {
    return ProtocolInfo.BLOCK_PICK_REQUEST_PACKET;
  }

  initVars() {
    this.blockX = -1;
    this.blockY = -1;
    this.blockZ = -1;
    this.addUserData = false;
    this.hotbarSlot = -1;
  }

  _decodePayload() {
    this.readSignedBlockPosition(this.blockX, this.blockY, this.blockZ);
    this.addUserData = this.readBool();
    this.hotbarSlot = this.readByte();
  }

  _encodePayload() {
    this.writeSignedBlockPosition(this.blockX, this.blockY, this.blockZ);
    this.writeBool(this.addUserData);
    this.writeByte(this.hotbarSlot);
  }

  handle(session) {
    return session.handleBlockPickRequest(this);
  }

}

module.exports = BlockPickRequestPacket;