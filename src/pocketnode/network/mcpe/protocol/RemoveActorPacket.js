const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class RemoveActorPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.REMOVE_ACTOR_PACKET;

    /** @type {number} */
    entityUniqueId

    _decodePayload() {
        this.entityUniqueId = this.readEntityUniqueId();
    }

    _encodePayload() {
        this.writeEntityUniqueId(this.entityUniqueId);
    }

    handle(session) {
        return session.handleRemoveActor(this);
    }
}

module.exports = RemoveActorPacket;