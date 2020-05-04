const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ClientCacheStatusPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.CLIENT_CACHE_STATUS_PACKET;

    /** @type {boolean} */
    enabled;

    _decodePayload() {
        this.enabled = this.readBool();
    }

    _encodePayload() {
        this.writeBool(this.enabled);
    }
}

module.exports = ClientCacheStatusPacket;
