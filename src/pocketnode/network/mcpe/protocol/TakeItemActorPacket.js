const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class TakeItemActorPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.TAKE_ITEM_ACTOR_PACKET;

    /** @type {number} */
    target;
    /** @type {number} */
    eid;

    _decodePayload() {
        this.target = this.readEntityRuntimeId();
        this.eid = this.readEntityRuntimeId();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.target);
        this.writeEntityRuntimeId(this.eid);
    }

    handle(session) {
        return session.handleTakeItemActor(this);
    }
}

module.exports = TakeItemActorPacket;