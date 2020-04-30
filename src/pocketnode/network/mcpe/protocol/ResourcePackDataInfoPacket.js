const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");
const ResourcePackType = require("./types/ResourcePackType");

class ResourcePackDataInfoPacket extends DataPacket {

    static getId() {
        return ProtocolInfo.RESOURCE_PACK_DATA_INFO_PACKET;
    }

    /** @type {string} */
    packId;
    /** @type {number} */
    maxChunkSize;
    /** @type {number} */
    chunkCount;
    /** @type {number} */
    compressedPackSize;
    /** @type {string} */
    sha256;
    /** @type {boolean} */
    isPremium;
    /** @type {number} */
    packType = ResourcePackType.RESOURCES;

    _decodePayload() {
        this.packId = this.readString();
        this.maxChunkSize = this.readLInt();
        this.chunkCount = this.readLInt();
        this.compressedPackSize = this.readLLong();
        this.sha256 = this.readString();
        this.isPremium = this.readBool();
        this.packType = this.readByte();
    }

    _encodePayload() {
        this.writeString(this.packId);
        this.writeLInt(this.maxChunkSize);
        this.writeLInt(this.chunkCount);
        this.writeLLong(this.compressedPackSize);
        this.writeString(this.sha256);
        this.writeBool(this.isPremium);
        this.writeByte(this.packType);
    }
}

module.exports = ResourcePackDataInfoPacket;