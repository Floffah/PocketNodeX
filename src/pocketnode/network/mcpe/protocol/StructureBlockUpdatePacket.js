const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class StructureBlockUpdatePacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.STRUCTURE_BLOCK_UPDATE_PACKET;

    _decodePayload() {
        //TODO
    }

    _encodePayload() {
        //TODO
    }

    handle(session) {
        return session.handleStructureBlockUpdate(this);
    }
}

module.exports = StructureBlockUpdatePacket;