const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class LevelChunkPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.LEVEL_CHUNK_PACKET;
  }

  initVars() {
    this.chunkX = 0;
    this.chunkZ = 0;
    this.subChunkCount = 0;
    this.cacheEnabled = false;
    this.usedBlobHashes = [];
    this.extraPayload = "";
  }

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