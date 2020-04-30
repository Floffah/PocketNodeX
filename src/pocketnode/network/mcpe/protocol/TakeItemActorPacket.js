const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class TakeItemActorPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.TAKE_ITEM_ACTOR_PACKET;
    }

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