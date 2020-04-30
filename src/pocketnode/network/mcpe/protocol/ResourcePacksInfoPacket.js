const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ResourcePacksInfoPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.RESOURCE_PACKS_INFO_PACKET;
  }

  initVars() {
    this.mustAccept = false;
    this.hasScripts = false;
    this.behaviorPackEntries = [];
    this.resourcePackEntries = [];
  }

  _decodePayload() {
    this.mustAccept = this.readBool();
    this.hasScripts = this.readBool();
    let behaviourPackCount = this.readLShort();

    while (behaviourPackCount-- > 0) {
      this.readString();
      this.readString();
      this.readLLong();
      this.readString();
      this.readString();
      this.readString();
      this.readBool();
    }

    let resourcePackCount = this.readLShort();

    while (resourcePackCount-- > 0) {
      this.readString();
      this.readString();
      this.readLLong();
      this.readString();
      this.readString();
      this.readString();
      this.readBool();
    }
  }

  _encodePayload() {
    this.writeBool(this.mustAccept);
    this.writeBool(this.hasScripts);
    this.writeLShort(this.behaviorPackEntries.length);
    this.behaviorPackEntries.forEach(entry => {
      this.writeString(entry.getPackId());
      this.writeString(entry.getPackVersion());
      this.writeLLong(entry.getPackSize());
      this.writeString("");
      this.writeString("");
      this.writeString("");
      this.writeBool(false);
    });
    this.writeLShort(this.resourcePackEntries.length);
    this.resourcePackEntries.forEach(entry => {
      this.writeString(entry.getPackId());
      this.writeString(entry.getPackVersion());
      this.writeLLong(entry.getPackSize());
      this.writeString("");
      this.writeString("");
      this.writeString("");
      this.writeBool(false);
    });
  }

}

module.exports = ResourcePacksInfoPacket;