const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

const Vector3 = require("../../../math/Vector3");

class AddPaintingPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.ADD_PAINTING_PACKET;
    }

    /** @type {number|null} */
    entityUniqueId = null;
    /** @type {number} */
    entityRuntimeId;
    /** @type {number} */
    position = new Vector3();
    /** @type {Vector3} */
    direction;
    /** @type {string} */
    title = "";

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