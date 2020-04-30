function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const PlayerListEntry = require('./types/PlayerListEntry');

class PlayerListPacket extends DataPacket {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "entries", []);

    _defineProperty(this, "type", -1);
  }

  static getId() {
    return ProtocolInfo.PLAYER_LIST_PACKET;
  }

  clean() {
    this.entries = [];
    super.clean();
  }

  _decodePayload() {
    this.type = this.readByte();
    let count = this.readUnsignedVarInt();

    for (let i = 0; i < count; i++) {
      let entry = new PlayerListEntry();

      if (this.type === PlayerListPacket.TYPE_ADD) {
        entry.uuid = this.readUUID();
        entry.entityUniqueId = this.readEntityUniqueId();
        entry.username = this.readString();
        entry.xboxUserId = this.readString();
        entry.platformChatId = this.readString();
        entry.buildPlatform = this.readLInt();
        entry.skinData = this.readSkin();
        entry.isTeacher = this.readBool();
        entry.isHost = this.readBool();
      } else {
        entry.uuid = this.readUUID();
      }

      this.entries[i] = entry;
    }
  }

  _encodePayload() {
    this.writeByte(this.type);
    this.writeUnsignedVarInt(this.entries.length);
    this.entries.forEach(entry => {
      if (this.type === PlayerListPacket.TYPE_ADD) {
        this.writeUUID(entry.uuid);
        this.writeEntityUniqueId(entry.entityUniqueId);
        this.writeString(entry.username);
        this.writeString(entry.xboxUserId);
        this.writeString(entry.platformChatId);
        this.writeLInt(entry.buildPlatform);
        this.writeSkin(entry.skinData);
        this.writeBool(entry.isTeacher);
        this.writeBool(entry.isHost);
      } else {
        this.writeUUID(entry.uuid);
      }
    });
  }

}

_defineProperty(PlayerListPacket, "TYPE_ADD", 0);

_defineProperty(PlayerListPacket, "TYPE_REMOVE", 1);

module.exports = PlayerListPacket;