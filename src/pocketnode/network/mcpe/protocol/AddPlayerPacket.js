const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class AddPlayerPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.ADD_PLAYER_PACKET;
  }

  initVars() {
    this.uuid = null;
    this.username = "";
    this.entityUniqueId = null; //TODO

    this.entityRuntimeId = -1;
    this.platformChatId = "";
    this.position = new Vector3();
    this.motion = new Vector3();
    this.pitch = 0.0;
    this.yaw = 0.0;
    this.headYaw = null; //TODO

    this.item = new Item();
    this.metadata = []; //TODO: adventure settings stuff

    this.uvarint1 = 0;
    this.uvarint2 = 0;
    this.uvarint3 = 0;
    this.uvarint4 = 0;
    this.uvarint5 = 0;
    this.long1 = 0;
    this.links = [];
    this.deviceId = ""; //TODO: fill player's device ID (???)
  }

  _decodePayload() {
    this.uuid = this.readUUID();
    this.username = this.readString();
    this.entityUniqueId = this.getEntityUniqueId();
    this.entityRuntimeId = this.getEntityRuntimeId();
    this.platformChatId = this.readString();
    this.position = this.getVector3Obj();
    this.motion = this.getVector3Obj();
    this.pitch = this.readLFloat();
    this.yaw = this.readLFloat();
    this.headYaw = this.readLFloat(); //this.item = this.getSlot;

    this.item = null; //TODO

    this.metadata = this.readEntityMetadata();
    this.uvarint1 = this.readUnsignedVarInt();
    this.uvarint2 = this.readUnsignedVarInt();
    this.uvarint3 = this.readUnsignedVarInt();
    this.uvarint4 = this.readUnsignedVarInt();
    this.uvarint5 = this.readUnsignedVarInt();
    this.long1 = this.readLLong();
    let linkCount = this.readUnsignedVarInt();

    for (let i = 0; i < linkCount; ++i) {//this.links[i] = this.
      //TODO
    }

    this.deviceId = this.readString();
  }

  _encodePayload() {
    this.readUUID(this.uuid);
    this.writeString(this.username);
    this.writeEntityUniqueId(this.entityUniqueId ? this.entityRuntimeId : this.entityRuntimeId);
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeString(this.platformChatId);
    this.writeVector3(this.position);
    this.writeVector3(this.motion); //TODO: nullable

    this.writeLFloat(this.pitch);
    this.writeLFloat(this.yaw);
    this.writeLFloat(this.headYaw ? this.yaw : this.yaw); //todo: this.writeSlot(this.item);
    //todo: this.writeEntityMetadata(this.metadata);

    this.writeUnsignedVarInt(this.uvarint1);
    this.writeUnsignedVarInt(this.uvarint2);
    this.writeUnsignedVarInt(this.uvarint3);
    this.writeUnsignedVarInt(this.uvarint4);
    this.writeUnsignedVarInt(this.uvarint5);
    this.writeLLong(this.long1); // TODO
    // this.writeUnsignedVarInt(this.links.length);

    this.writeUnsignedVarInt(0);
    this.links.forEach(link => {//TODO: this.writeEntityLink(link);
    });
    this.writeString(this.deviceId);
  }

  handle(session) {
    return session.handleAddPlayer(this);
  }

}

module.exports = AddPlayerPacket;