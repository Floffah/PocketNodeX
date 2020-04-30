const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class MobEquipmentPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.MOB_EQUIPMENT_PACKET;
  }

  initVars() {
    this.entityRuntimeId = -1;
    this.item = null;
    this.inventorySlot = -1;
    this.hotbarSlot = -1;
    this.windowId = 0;
  }

  _decodePayload() {
    this.entityRuntimeId = this.readEntityRuntimeId();
    this.item = this.readSlot();
    this.inventorySlot = this.readByte();
    this.hotbarSlot = this.readByte();
    this.windowId = this.readByte();
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeSlot(this.item);
    this.writeByte(this.inventorySlot);
    this.writeByte(this.hotbarSlot);
    this.writeByte(this.windowId);
  }

  handle(session) {
    return session.handleMobEquipment(this);
  }

}

module.exports = MobEquipmentPacket;