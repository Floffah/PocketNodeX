const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const Vector3 = require("../../../math/Vector3");

class LevelSoundEventPacketV1 extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.LEVEL_SOUND_EVENT_PACKET_V1;
  }

  initVars() {
    /** @type {number} */
    this.sound = -1;
    /** @type {Vector3} */

    this.position = null;
    /** @type {number} */

    this.extraData = 0;
    /** @type {number} */

    this.entityType = 1;
    /** @type {boolean} */

    this.isBabyMob = false; //...

    /** @type {boolean} */

    this.disableRelativeVolume = false;
  }

  _decodePayload() {
    this.sound = this.readByte();
    this.position = this.readVector3();
    this.extraData = this.readVarInt();
    this.entityType = this.readVarInt();
    this.isBabyMob = this.readBool();
    this.disableRelativeVolume = this.readBool();
  }

  _encodePayload() {
    this.writeByte(this.sound);
    this.writeVector3(this.position);
    this.writeVarInt(this.extraData);
    this.writeVarInt(this.entityType);
    this.writeBool(this.isBabyMob);
    this.writeBool(this.disableRelativeVolume);
  }

  handle(session) {
    return session.handleLevelSoundEventPacketV1(this);
  }

}

module.exports = LevelSoundEventPacketV1;