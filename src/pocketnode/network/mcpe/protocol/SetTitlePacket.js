const DataPacket = require("./DataPacket");

const MinecraftInfo = require("../Info");

class SetTitlePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get TYPE_CLEAR_TITLE() {
    return 0;
  }

  static get TYPE_RESET_TITLE() {
    return 1;
  }

  static get TYPE_SET_TITLE() {
    return 2;
  }

  static get TYPE_SET_SUBTITLE() {
    return 3;
  }

  static get TYPE_SET_ACTIONBAR_MESSAGE() {
    return 4;
  }

  static get TYPE_SET_ANIMATION_TIMES() {
    return 5;
  }

  static getId() {
    return MinecraftInfo.SET_TITLE_PACKET;
  }

  initVars() {
    this.type = 0;
    this.text = "";
    this.fadeInTime = 0;
    this.stayTime = 0;
    this.fadeOutTime = 0;
  }

  _decodePayload() {
    this.type = this.readVarInt();
    this.text = this.readString();
    this.fadeInTime = this.readVarInt();
    this.stayTime = this.readVarInt();
    this.fadeOutTime = this.readVarInt();
  }

  _encodePayload() {
    this.writeVarInt(this.type);
    this.writeString(this.text);
    this.writeVarInt(this.fadeInTime);
    this.writeVarInt(this.stayTime);
    this.writeVarInt(this.fadeOutTime);
  }

  handle(session) {
    return session.handleSetTitle(this);
  }

}

module.exports = SetTitlePacket;