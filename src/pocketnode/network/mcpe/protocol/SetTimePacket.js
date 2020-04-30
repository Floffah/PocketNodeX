const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class SetTimePacket extends DataPacket {
    static getId() {
        return ProtocolInfo.SET_TIME_PACKET;
    }

    /** @type {number} */
    time = 0;

    _decodePayload() {
        this.time = this.readVarInt();
    }

    _encodePayload() {
        this.writeVarInt(this.time);
    }

    handle(session) {
        return session.handleSetTime(this);
    }
}

module.exports = SetTimePacket;