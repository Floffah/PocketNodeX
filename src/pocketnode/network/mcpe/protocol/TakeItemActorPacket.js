const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class TakeItemActorPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.TAKE_ITEM_ACTOR_PACKET;
  }

  initVars() {
    /** @type {number} */
    this.target = -1;
    /** @type {number} */

    this.eid = -1;
  }

  _decodePayload() {
    this.target = this.readEntityRuntimeId();
    this.eid = this.readEntityRuntimeId();
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.target);
    this.writeEntityRuntimeId(this.eid);
  }

  handle(session) {
    return session.handleTakeItemActor(this);
  }

}

module.exports = TakeItemActorPacket;