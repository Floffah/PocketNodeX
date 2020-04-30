const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const Vector3 = require("../../../math/Vector3");

class MoveActorAbsolutePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get FLAG_GROUND() {
    return 0x01;
  }

  static get FLAG_TELEPORT() {
    return 0x02;
  }

  static getId() {
    return ProtocolInfo.MOVE_ACTOR_ABSOLUTE_PACKET;
  }

  initVars() {
    /** @type {number} */
    this.entityRuntimeId = -1;
    /** @type {number} */

    this.flags = 0;
    /** @type {Vector3} */

    this.position = new Vector3();
    /** @type {number} */

    this.xRot = -1;
    /** @type {number} */

    this.yRot = -1;
    /** @type {number} */

    this.zRot = -1;
  }

  _decodePayload() {
    this.entityRuntimeId = this.readEntityRuntimeId();
    this.flags = this.readByte();
    this.position = this.readVector3();
    this.xRot = this.readByteRotation();
    this.yRot = this.readByteRotation();
    this.zRot = this.readByteRotation();
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeByte(this.flags);
    this.writeVector3(this.position);
    this.writeByteRotation(this.xRot);
    this.writeByteRotation(this.yRot);
    this.writeByteRotation(this.zRot);
  }

  handle(session) {
    return session.handleMoveActorAbsolute(this);
  }

}

module.exports = MoveActorAbsolutePacket;