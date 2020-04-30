const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class InteractPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get ACTION_LEAVE_VEHICLE() {
    return 3;
  }

  static get ACTION_MOUSEOVER() {
    return 4;
  }

  static get ACTION_OPEN_INVENTORY() {
    return 6;
  }

  static getId() {
    return ProtocolInfo.INTERACT_PACKET;
  }

  initVars() {
    this.action = -1;
    this.target = -1;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
  }

  _decodePayload() {
    this.action = this.readByte();
    this.target = this.readEntityRuntimeId();

    if (this.action === InteractPacket.ACTION_MOUSEOVER) {
      //TODO: should this be a vector3?
      this.x = this.readLFloat();
      this.y = this.readLFloat();
      this.z = this.readLFloat();
    }
  }

  _encodePayload() {
    this.writeByte(this.action);
    this.writeEntityRuntimeId(this.target);

    if (this.action === InteractPacket.ACTION_MOUSEOVER) {
      this.writeLFloat(this.x);
      this.writeLFloat(this.y);
      this.writeLFloat(this.z);
    }
  }

  handle(session) {
    return session.handleInteract(this);
  }

}

module.exports = InteractPacket;