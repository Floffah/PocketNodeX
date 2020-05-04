const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class MobEquipmentPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.MOB_EQUIPMENT_PACKET;

    /** @type {number} */
    entityRuntimeId;
    item = null;
    /** @type {number} */
    inventorySlot;
    /** @type {number} */
    hotbarSlot;
    /** @type {number} */
    windowId;

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