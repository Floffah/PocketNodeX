const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class LevelChunkPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.LEVEL_CHUNK_PACKET;

    /** @type {number} */
    chunkX = 0;
    /** @type {number} */
    chunkZ = 0;
    /** @type {number} */
    subChunkCount = 0;
    /** @type {boolean} */
    cacheEnabled = false;
    /** @type {any} */
    usedBlobHashes = [];
    /** @type {string} */
    extraPayload;

    _decodePayload() {
        this.chunkX = this.readVarInt();
        this.chunkZ = this.readVarInt();
        this.subChunkCount = this.readUnsignedVarInt();
        this.cacheEnabled = this.readBool();
        if (this.cacheEnabled) {
            for (let i = 0, count = this.readUnsignedVarInt(); i < count; ++i) {
                this.usedBlobHashes.push(this.readLLong());
            }
        }
        this.extraPayload = this.readString();
    }

    _encodePayload() {
        this.writeVarInt(this.chunkX);
        this.writeVarInt(this.chunkZ);
        this.writeUnsignedVarInt(this.subChunkCount);
        this.writeBool(this.cacheEnabled);

        if (this.cacheEnabled) {
            this.writeUnsignedVarInt(this.usedBlobHashes.length);
            this.usedBlobHashes.forEach(hash => {
                this.writeLLong(hash);
            });
        }
        this.writeString(this.extraPayload);
    }

    /*static withoutCache(chunkX, chunkZ, subChunkCount, payload){
        let result = new FullChunkDataPacket();
        result.chunkX = chunkX;
        result.chunkZ = chunkZ;
        result.subChunkCount = subChunkCount;
        result.extraPayload = payload;

        result.cacheEnabled = false;

        return result;
    }*/
}

module.exports = LevelChunkPacket;