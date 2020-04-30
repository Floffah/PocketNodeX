const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ActorFallPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.ACTOR_FALL_PACKET;
  }

  initVars() {
    this.entityRuntimeId = -1;
    this.fallDistance = -1;
    this.isInVoid = false;
  }

  _decodePayload() {
    this.entityRuntimeId = this.readEntityRuntimeId();
    this.fallDistance = this.readLFloat();
    this.isInVoid = this.readBool();
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeLFloat(this.fallDistance);
    this.writeBool(this.isInVoid);
  }

  handle(session) {
    return session.handleActorFall(this);
  }

}

module.exports = ActorFallPacket;