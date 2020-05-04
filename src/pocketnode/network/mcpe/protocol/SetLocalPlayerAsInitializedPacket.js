const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class SetLocalPlayerAsInitializedPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SET_LOCAL_PLAYER_AS_INITIALIZED_PACKET;

    /** @type {number} */
    entityRuntimeId

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
    }

    handle(session) {
        return session.handleSetLocalPlayerAsInitialized(this);
    }
}

module.exports = SetLocalPlayerAsInitializedPacket;