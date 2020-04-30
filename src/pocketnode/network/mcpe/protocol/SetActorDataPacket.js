const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class SetActorDataPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.SET_ACTOR_DATA_PACKET;
    }

    /** @type {number} */
    entityRuntimeId;
    /** @type {any} */
    metadata = null;

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
        this.metadata = this.readEntityMetadata();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeEntityMetadata(this.metadata);
    }

    handle(session) {
        return session.handleSetEntityData(this);
    }
}

module.exports = SetActorDataPacket;