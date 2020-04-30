const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ActorPickRequestPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.ACTOR_PICK_REQUEST_PACKET;
  }

  initVars() {
    /** @type {number} */
    this.entityUniqueId = -1;
    /** @type {number} */

    this.hotbarSlot = -1;
  }

  _decodePayload() {
    this.entityUniqueId = this.readLLong();
    this.hotbarSlot = this.readByte();
  }

  _encodePayload() {
    this.writeLLong(this.entityUniqueId);
    this.writeByte(this.hotbarSlot);
  }

  handle(session) {
    return session.handleActorPickRequest(this);
  }

}

module.exports = ActorPickRequestPacket;