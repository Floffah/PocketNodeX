const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ResourcePackChunkDataPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_CHUNK_DATA_PACKET;

    /** @type {string} */
    packId = "";
    /** @type {number} */
    chunkIndex = 0;
    /** @type {number} */
    progress = 0;
    /** @type {string} */
    data = "";

    _decodePayload() {
        this.packId = this.readString();
        this.chunkIndex = this.readLInt();
        this.progress = this.readLLong();
        this.data = this.readString();
    }

    _encodePayload() {
        this.writeString(this.packId);
        this.writeLInt(this.chunkIndex);
        this.writeLLong(this.progress);
        this.writeString(this.data)
    }
}

module.exports = ResourcePackChunkDataPacket;