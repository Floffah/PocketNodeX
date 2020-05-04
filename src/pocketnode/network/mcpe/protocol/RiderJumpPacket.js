const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class RiderJumpPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RIDER_JUMP_PACKET;

    /** @type {number} */
    jumpStrenght;  // percentage

    _decodePayload() {
        this.jumpStrenght = this.readVarInt();
    }

    _encodePayload() {
        this.writeVarInt(this.jumpStrenght);
    }

    handle(session) {
        return session.handleRiderJump(this);
    }
}

module.exports = RiderJumpPacket;