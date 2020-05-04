const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class AddEntityPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.ADD_ENTITY_PACKET;

    /** @type {number} */
    uvarint1d;

    create(uvarint1) {
        let result = new self;
        result.uvarint1 = uvarint1;
        return result;
    }

    /**
     *
     * @return {number}
     */
    getUvarint1() {
        return this.uvarint1d;
    }

    _decodePayload() {
        this.uvarint1d = this.writeUnsignedVarInt();
    }

    _encodePayload() {
        this.writeUnsignedVarInt(this.uvarint1d);
    }

    handle(session) {
        return session.handleAddEntity(this);
    }
}

module.exports = AddEntityPacket;