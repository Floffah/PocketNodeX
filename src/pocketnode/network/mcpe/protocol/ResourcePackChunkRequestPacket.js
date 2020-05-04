const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ResourcePackChunkRequestPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_CHUNK_REQUEST_PACKET;

    /** @type {string} */
    packId;
    /** @type {number} */
    chunkIndex;

    _decodePayload() {
        this.packId = this.readString();
        this.chunkIndex = this.readLInt();
    }

    _encodePayload() {
        this.writeString(this.packId);
        this.writeLInt(this.chunkIndex);
    }

    handle(session) {
        return session.handleResourcePackChunkRequest(this);
    }
}

module.exports = ResourcePackChunkRequestPacket;