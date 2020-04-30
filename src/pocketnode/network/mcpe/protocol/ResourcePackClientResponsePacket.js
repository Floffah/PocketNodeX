const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ResourcePackClientResponsePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get STATUS_REFUSED() {
    return 1;
  }

  static get STATUS_SEND_PACKS() {
    return 2;
  }

  static get STATUS_HAVE_ALL_PACKS() {
    return 3;
  }

  static get STATUS_COMPLETED() {
    return 4;
  }

  static getId() {
    return ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE_PACKET;
  }

  static STATUS(status) {
    switch (status) {
      case ResourcePackClientResponsePacket.STATUS_REFUSED:
        return "REFUSED";

      case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
        return "SEND_PACKS";

      case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
        return "HAVE_ALL_PACKS";

      case ResourcePackClientResponsePacket.STATUS_COMPLETED:
        return "COMPLETED";
    }
  }

  initVars() {
    this.status = 0;
    this.packIds = [];
  }

  _decodePayload() {
    this.status = this.readByte();
    let entryCount = this.readLShort();

    while (entryCount-- > 0) {
      this.packIds.push(this.readString());
    }
  }

  _encodePayload() {
    this.writeByte(this.status);
    this.writeLShort(this.packIds.length);
    this.packIds.forEach(id => {
      this.writeString(id);
    });
  }

  handle(session) {
    return session.handleResourcePackClientResponse(this);
  }

}

module.exports = ResourcePackClientResponsePacket;