const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class MobArmorEquipmentPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.MOB_ARMOR_EQUIPMENT_PACKET;
  }

  initVars() {
    this.entityRuntimeId = -1; //this intentionally doesn't use an array because we don't want any implicit dependencies on internal order

    this.head = null;
    this.chest = null;
    this.legs = null;
    this.feet = null;
  }

  _decodePayload() {
    this.entityRuntimeId = this.getEntityRuntimeId();
    this.head = this.readSlot();
    this.chest = this.readSlot();
    this.legs = this.readSlot();
    this.feet = this.readSlot();
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeSlot(this.head);
    this.writeSlot(this.chest);
    this.writeSlot(this.legs);
    this.writeSlot(this.feet);
  }

  handle(session) {
    return session.handleMobArmorEquipment(this);
  }

}

module.exports = MobArmorEquipmentPacket;