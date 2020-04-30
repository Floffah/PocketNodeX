const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class ActorFallPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.ACTOR_FALL_PACKET;
    }

    /** @type {number} */
    entityRuntimeId;
    /** @type {number} */
    fallDistance;
    /** @type {boolean} */
    isInVoid = false;

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