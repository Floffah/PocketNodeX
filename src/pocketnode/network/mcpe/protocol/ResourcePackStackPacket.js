function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class ResourcePackStackPacket extends DataPacket {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "mustAccept", false);

    _defineProperty(this, "behaviorPackStack", []);

    _defineProperty(this, "resourcePackStack", []);

    _defineProperty(this, "isExperimental", false);

    _defineProperty(this, "baseGameVersion", '1.14.0');
  }

  static getId() {
    return ProtocolInfo.RESOURCE_PACK_STACK_PACKET;
  }
  /** @type {boolean} */


  _decodePayload() {
    this.mustAccept = this.readBool();
    let behaviorPackCount = this.readUnsignedVarInt();

    while (behaviorPackCount-- > 0) {
      this.readString();
      this.readString();
      this.readString();
    }

    let resourcePackCount = this.readUnsignedVarInt();

    while (resourcePackCount-- > 0) {
      this.readString();
      this.readString();
      this.readString();
    }

    this.isExperimental = this.readBool();
    this.baseGameVersion = this.readString();
  }

  _encodePayload() {
    this.writeBool(this.mustAccept);
    this.writeUnsignedVarInt(this.behaviorPackStack.length);
    this.behaviorPackStack.forEach(entry => {
      this.writeString(entry.getPackId());
      this.writeString(entry.getPackVersion());
      this.writeString("");
    });
    this.writeUnsignedVarInt(this.resourcePackStack.length);
    this.resourcePackStack.forEach(entry => {
      this.writeString(entry.getPackId());
      this.writeString(entry.getPackVersion());
      this.writeString("");
    });
    this.writeBool(this.isExperimental);
    this.writeString(this.baseGameVersion);
  }

}

module.exports = ResourcePackStackPacket;