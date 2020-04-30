const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class StructureBlockUpdatePacket extends DataPacket {
    static getId() {
        return ProtocolInfo.STRUCTURE_BLOCK_UPDATE_PACKET;
    }

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