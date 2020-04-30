const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class AnimatePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get ACTION_SWING_ARM() {
    return 1;
  }

  static get ACTION_STOP_SLEEP() {
    return 3;
  }

  static get ACTION_CRITICAL_HIT() {
    return 4;
  }

  static getId() {
    return ProtocolInfo.ANIMATE_PACKET;
  }

  initVars() {
    /** @type {number} */
    this.action = -1;
    /** @type {number} */

    this.entityRuntimeId = -1;
    /** @type {number} */

    this.float = 0.0; //TODO (Boat rowing time?)
  }

  _decodePayload() {
    this.action = this.readVarInt();
    this.entityRuntimeId = this.readEntityRuntimeId();

    if (this.action & 0x80) {
      this.float = this.readLFloat();
    }
  }

  _encodePayload() {
    this.writeVarInt(this.action);
    this.writeEntityRuntimeId(this.entityRuntimeId);

    if (this.action & 0x80) {
      this.writeLFloat(this.float);
    }
  }

  handle(session) {
    return session.handleAnimate(this);
  }

}

module.exports = AnimatePacket;