const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class BlockEventPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.BLOCK_EVENT_PACKET;
    }

    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    z;

    /** @type {number} */
    eventType;
    /** @type {number} */
    eventData;

    _decodePayload() {
        this.readBlockPosition(this.x, this.y, this.z);
        this.eventType = this.readVarInt();
        this.eventData = this.readVarInt();
    }

    _encodePayload() {
        this.writeBlockPosition(this.x, this.y, this.z);
        this.writeVarInt(this.eventType);
        this.writeVarInt(this.eventData);
    }

    handle(session) {
        return session.handleBlockEvent(this);
    }
}

module.exports = BlockEventPacket;