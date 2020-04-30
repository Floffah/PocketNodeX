const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ResourcePackChunkRequestPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.RESOURCE_PACK_CHUNK_REQUEST_PACKET;
  }

  initVars() {
    this.packId = "";
    this.chunkIndex = 0;
  }

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