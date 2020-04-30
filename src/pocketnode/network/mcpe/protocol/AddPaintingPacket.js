const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const Vector3 = require("../../../math/Vector3");

class AddPaintingPacket extends DataPacket {
  getId() {
    return ProtocolInfo.ADD_PAINTING_PACKET;
  }

  initVars() {
    /** @type {number|null} */
    this.entityUniqueId = null;
    /** @type {number} */

    this.entityRuntimeId = -1;
    /** @type {Vector3} */

    this.position = null;
    /** @type {number} */

    this.direction = -1;
    /** @type {string} */

    this.title = "";
  }

  _decodePayload() {
    this.entityUniqueId = this.readEntityUniqueId();
    this.entityRuntimeId = this.readEntityRuntimeId();
    this.position = this.readVector3();
    this.direction = this.readVarInt();
    this.title = this.readString();
  }

  _encodePayload() {
    this.writeEntityUniqueId(this.entityUniqueId || this.entityRuntimeId);
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeVector3(this.position);
    this.writeVarInt(this.direction);
    this.writeString(this.title);
  }

  handle(session) {
    return session.handleAddPainting(this);
  }

}

module.exports = AddPaintingPacket;