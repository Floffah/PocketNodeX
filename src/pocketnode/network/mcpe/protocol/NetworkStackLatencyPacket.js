const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class NetworkStackLatencyPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.NETWORK_STACK_LATENCY_PACKET;
    }

    /** @type {number} */
    timestamp = null;
    /** @type {boolean} */
    needResponse = false;

    _decodePayload() {
        this.timestamp = this.readLLong();
        this.needResponse = this.readBool();
    }

    _encodePayload() {
        this.writeLLong(this.timestamp);
        this.writeBool(this.needResponse);
    }

    handle(session) {
        return true;
    }
}

module.exports = NetworkStackLatencyPacket;